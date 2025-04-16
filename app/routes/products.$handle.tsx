import {useCallback, useEffect, useMemo, useRef} from 'react';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {useState} from 'react';
import {Image} from '@shopify/hydrogen';
import {ProductImage} from '~/components/ProductImage';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductForm} from '~/components/ProductForm';
import {
  getSelectedProductOptions,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  Analytics,
} from '@shopify/hydrogen';
import {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {TextInput, ToggleSwitch, RangeSlider, Label} from 'flowbite-react';
import {IParameterApi} from '@shapediver/viewer.session';
import {debounce} from '~/helpers/debounce';
import {useSession} from '~/shared/context/SessionContext';

interface IProductImageNode {
  id?: string | null;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
}

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: `Hydrogen | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  return {
    product,
  };
}

function loadDeferredData({context, params}: LoaderFunctionArgs) {
  return {};
}

export default function Product() {
  const {product} = useLoaderData<typeof loader>();

  // States
  const initialImage = product.images?.edges?.[0]?.node;
  const [selectedImage, setSelectedImage] = useState<IProductImageNode | null>(
    initialImage,
  );
  const [isCustomImageSelected, setIsCustomImageSelected] = useState(false); // Track custom image selection
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sessionRef = useRef<any | null>(null);
  const [parameters, setParameters] = useState<any>([]);
  const {setSession} = useSession(); // Assuming you have a session context to set the session

  // Optimistic variant selection
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sync URL params with selected variant
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get product options
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  // Custom thumbnail click handler
  const handleCustomClick = () => {
    setSelectedImage(null); // Set to null or an empty state for a blank canvas
    setIsCustomImageSelected(true); // Set the boolean to true
  };

  const handleImageClick = (image: IProductImageNode) => {
    setSelectedImage(image);
    setIsCustomImageSelected(false); // Reset the boolean to false
  };

  useEffect(() => {
    const init = async () => {
      if (!canvasRef.current) return;

      try {
        const [{createSession}, {createViewport}] = await Promise.all([
          import('@shapediver/viewer.session'),
          import('@shapediver/viewer.viewport'),
        ]);
        await createViewport({canvas: canvasRef.current});

        const session = await createSession({
          ticket: ticketId,
          modelViewUrl: modelViewUrl!,
        });

        sessionRef.current = session;
        setSession(session); // Set the session in context

        const displayParameters = Object.values(session.parameters);
        setParameters(displayParameters);
      } catch (error) {
        console.error('Error initializing the session or viewport:', error);
      }
    };

    init();

    return () => {
      sessionRef.current?.close();
      sessionRef.current = null;
    };
  }, [selectedImage]);

  const {title, descriptionHtml} = product;
  const modelViewUrl = product.modelViewUrl?.value;
  const ticketId = product.ticketId?.value;

  const ProductDetails = useMemo(() => {
    return (
      <div className="product-main">
        <h1>{title}</h1>
        <ProductPrice
          price={selectedVariant?.price}
          compareAtPrice={selectedVariant?.compareAtPrice}
        />
        <br />
        <ProductForm
          productOptions={productOptions}
          selectedVariant={selectedVariant}
        />
        <br />
        <p>
          <strong>Description</strong>
        </p>
        <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
      </div>
    );
  }, []);

  const handleParameterChange = useCallback(
    debounce((value, id) => {
      const session = sessionRef.current;
      if (!session) return;
      const parameter = session.getParameterById(id);
      if (!parameter) return;
      parameter.value = value;
      session.customize().catch((error: any) => {
        console.error('Error customizing session:', error);
      });
    }, 1000),
    [],
  );

  return (
    <div className="product">
      <div className="product-gallery">
        {/* Main image display */}
        <div
          className={`main-image${
            isCustomImageSelected ? '-custom-selected' : ''
          }`}
        >
          {selectedImage ? (
            <ProductImage image={{...selectedImage, __typename: 'Image'}} />
          ) : isCustomImageSelected ? (
            <div
              style={{
                width: '100%',
                aspectRatio: '1/1',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <canvas id="viewer" ref={canvasRef} />
            </div>
          ) : (
            <p>No image available</p>
          )}
        </div>

        {/* Thumbnails */}
        <div className="thumbnails">
          {/* Existing thumbnails */}
          {product.images?.edges?.map(({node}: {node: IProductImageNode}) => (
            <Image
              key={node.id}
              data={node}
              width={80}
              height={80}
              alt={node.altText || title}
              className={`thumbnail ${
                selectedImage?.id === node.id ? 'active' : ''
              }`}
              onClick={() => handleImageClick(node)}
              style={{
                cursor: 'pointer',
                outline:
                  selectedImage?.id === node.id
                    ? '2px solid #000'
                    : '1px solid #ccc',
              }}
            />
          ))}

          {/* Custom thumbnail for configuring */}
          <div
            className={`thumbnail ${isCustomImageSelected ? 'active' : ''}`}
            onClick={handleCustomClick}
            style={{
              width: '80px',
              height: '80px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              border: isCustomImageSelected
                ? '2px solid #000'
                : '1px solid #ccc',
              marginRight: '8px',
            }}
          >
            <span role="img" aria-label="Configure" style={{fontSize: '24px'}}>
              ⚙️ {/* Symbol for "configure" */}
            </span>
          </div>
        </div>
        {isCustomImageSelected && ProductDetails}
      </div>

      {isCustomImageSelected && parameters.length > 0 && (
        <div>
          {parameters.map((parameter: IParameterApi<unknown>) => {
            if (parameter.hidden) return null;
            switch (parameter.type) {
              case 'Float':
              case 'Int':
                return (
                  <div key={parameter.id}>
                    <Label key={`${parameter.id}-label`} htmlFor={parameter.id}>
                      {parameter.name} - {String(parameter.value)}
                    </Label>
                    <RangeSlider
                      key={parameter.id}
                      id={parameter.id}
                      step={Math.pow(
                        10,
                        parameter.decimalplaces ? -parameter.decimalplaces : 0,
                      )}
                      min={parameter.min}
                      max={parameter.max}
                      value={
                        parameters.find(
                          (p: IParameterApi<unknown>) => p.id === parameter.id,
                        )?.value as number
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setParameters((prev: IParameterApi<unknown>[]) => {
                          (
                            prev.find((p) => p.id === parameter.id) as any
                          ).value = e.target.value;
                          return [...prev];
                        });
                        handleParameterChange(e.target.value, parameter.id);
                      }}
                    />
                  </div>
                );
              case 'Bool':
                return (
                  <div key={parameter.id}>
                    <Label key={`${parameter.id}-label`} htmlFor={parameter.id}>
                      {parameter.name}
                    </Label>
                    <ToggleSwitch
                      key={parameter.id}
                      id={parameter.id}
                      checked={
                        parameters.find(
                          (p: IParameterApi<unknown>) => p.id === parameter.id,
                        )?.value as boolean
                      }
                      onChange={(checked: boolean) => {
                        setParameters((prev: IParameterApi<boolean>[]) => {
                          (
                            prev.find(
                              (p: IParameterApi<boolean>) =>
                                p.id === parameter.id,
                            ) as IParameterApi<boolean>
                          ).value = checked;
                          return [...prev];
                        });
                        handleParameterChange(checked, parameter.id);
                      }}
                    />
                  </div>
                );
              case 'String':
              case 'Color':
              case 'StringList':
                return (
                  <div key={parameter.id}>
                    <label htmlFor={parameter.id}>{parameter.name}</label>
                    <TextInput
                      value={
                        parameters.find(
                          (p: IParameterApi<string>) => p.id === parameter.id,
                        )?.value as string
                      }
                      onChange={(e) => {
                        setParameters((prev: IParameterApi<unknown>[]) => {
                          (
                            prev.find(
                              (p: IParameterApi<unknown>) =>
                                p.id === parameter.id,
                            ) as any
                          ).value = e.target.value;
                          return [...prev];
                        });
                        handleParameterChange(e.target.value, parameter.id);
                      }}
                    />
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
      )}

      {!isCustomImageSelected && ProductDetails}

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    images(first: 10) {
      edges {
        node {
          id
          url
          altText
          width
          height
        }
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
    modelViewUrl: metafield(namespace: "custom", key: "modelviewurl") {
      value
    }
    ticketId: metafield(namespace: "custom", key: "ticketid") {
      value
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
