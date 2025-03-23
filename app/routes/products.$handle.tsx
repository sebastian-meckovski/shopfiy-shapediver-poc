import {useEffect, useRef} from 'react';
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
import {
  createSession,
  IParameterApi,
  ISessionApi,
  sessions,
  VISIBILITY_MODE,
} from '@shapediver/viewer.session';
import {createViewport} from '@shapediver/viewer.viewport';

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
  const sessionRef = useRef<ISessionApi | null>(null);
  const [parameters, setParameters] = useState<IParameterApi<unknown>[]>([]);

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

  // Initialization: create the viewport and session, then retrieve the parameter.
  useEffect(() => {
    const init = async () => {
      console.log('Initializing session and viewport...');
      if (!canvasRef.current) return; // Skip if no canvas or already initialized.

      const canvasElement = canvasRef.current;
      const availableSessions = Object.values(sessions);
      const matchedSession = availableSessions.find((session) => {
        return session.ticket === ticketId;
      });

      if (matchedSession) {
        console.log('Matched session:', matchedSession);
        console.log('matched session id:', matchedSession.id);
        sessionRef.current = matchedSession;

        // these setting don't work... WTF
        const viewportCreted = await createViewport({
          canvas: canvasElement,
          visibility: VISIBILITY_MODE.SESSIONS,
          sessionSettingsId: '9d469805-7d49-48cf-9f86-9bff317a9ab0',
          visibilitySessionIds: ['9d469805-7d49-48cf-9f86-9bff317a9ab0'],
        });

        console.log('viewportCreted:', viewportCreted);
      } else {
        console.log('none matched session:', matchedSession);
        await createViewport({
          canvas: canvasElement,
        });
      }

      try {
        if (sessionRef.current) return; // Skip if already initialized or was loaded previously.

        console.log('canvasElement:', canvasElement);
        const session = await createSession({
          ticket: ticketId,
          modelViewUrl: modelViewUrl,
          // modelStateId: 'jBhllTMEzebfnKzv',
          // jwtToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDIzMTQyNDksImV4cCI6MTc0MjMxNzg0OSwibmJmIjoxNzQyMzE0MjQ5LCJpc3MiOiJodHRwczovL3NkcjhldWMxLmV1LWNlbnRyYWwtMS5zaGFwZWRpdmVyLmNvbSIsInN1YiI6ImM2NTM3NmY4LTZjMWQtNDdkNC05YWI2LTQ4ZWJlYjE3NDU1MiIsImF1ZCI6IjkyMDc5NGZhLTI0NWEtNDg3ZC04YWJlLWFmNTY5YTk3ZGE0MiIsImtpZCI6IjE2ZjY0NGYwZmVhNWU5N2U4NWJkYTI1ZmIzZDYyZjc3Iiwic2NvcGUiOiJncm91cC5leHBvcnQgZ3JvdXAudmlldyIsInNkX3VzZXJfaWQiOiI5ZTA1NWU3Yi0yYzc4LTQ0NDEtYWE1Ni03MjcxODhlOTQzMzciLCJzZF9vcmdfaWQiOm51bGwsInJ0bCI6bnVsbCwiY2hhcmdlIjpudWxsfQ.hIGfLjDK7nBm16uHgCgpBC84TbjZ1__3IvvZCdvxCyYF70lngL3z5W95vgGa-vt352pdpbud5Mys-6uVVZIsWaMpHesonJhkSQUxKs9I2ZQiPwe8ceepvxFye5ukV9DWCCXynTMRsWAlmluzSVTv4VrGdqWUcr7jTpX05tLAq_caNuZmoelXiy9KN9h05BC7arIb_1ofGxQSMItRY00cYXgrqFI5k4x7A4w6dMMnIK8UB58mXGG0_u_ebUp4-2022wazR-orN08vrOe3LvGPvN4U48Okl2GonILWsleGlHUc3IGW3RQI4jYOSMUPHetIzr-zyod98Biw9AvD0BSjbQ"
        });

        console.log('Session initialized:', session);
        sessionRef.current = session;

        const displayParameters: IParameterApi<unknown>[] = [];
        Object.keys(session.parameters).forEach((key) => {
          const param = session.parameters[key];
          displayParameters.push(param);
        });
        setParameters(displayParameters);
      } catch (error) {
        console.error('Error initializing the session or viewport:', error);
      }
    };

    init();
    return () => {
      // close the session - temporary measure until re-using sessions is solved
      const currentSession = sessionRef.current;
      currentSession?.close();
      sessionRef.current = null;
    };
  }, [selectedImage]);

  const {title, descriptionHtml} = product;
  const modelViewUrl = product.modelViewUrl.value;
  const ticketId = product.ticketId.value;

  console.log('product:', product);

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
      </div>

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
