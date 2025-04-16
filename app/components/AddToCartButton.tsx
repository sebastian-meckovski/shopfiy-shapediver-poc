import {type FetcherWithComponents} from '@remix-run/react';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import {Button} from 'flowbite-react';
import {useSession} from '~/shared/context/SessionContext';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
}) {
  const {session} = useSession(); // Assuming you have a session context to set the session

  const handleClick = async (
    event: React.MouseEvent<HTMLButtonElement>,
    fetcher: FetcherWithComponents<any>,
  ) => {
    event.preventDefault();

    // Wait for your simulated API call
    let modelStateId = await session?.createModelState();
    if (!modelStateId) {
      console.error('No model state ID found');
      return;
    }
    // Find the form element (using .closest() as a safer alternative)
    const form = (event.target as HTMLButtonElement).closest(
      'form',
    ) as HTMLFormElement;
    if (!form) {
      console.error('No form found');
      return;
    }

    const formData = new FormData(form);

    // Retrieve the "cartFormInput" field from the form data
    const cartFormInputField = formData.get('cartFormInput');
    if (cartFormInputField) {
      try {
        const cartFormInput = JSON.parse(cartFormInputField as string);
        const cartFormInputTyped = cartFormInput as {
          inputs: {lines: Array<any>};
        };
        cartFormInputTyped.inputs.lines = cartFormInputTyped.inputs.lines.map(
          (line: any) => {
            const newAttributes = [{key: 'modelStateId', value: modelStateId}];
            return {...line, attributes: newAttributes};
          },
        );
        // Override the cartFormInput as needed
        formData.set('cartFormInput', JSON.stringify(cartFormInput));
      } catch (error) {
        console.error('Error parsing cartFormInput:', error);
      }
    } else {
      console.warn('cartFormInput field not found in form data');
    }

    // Finally, submit the modified formData using fetcher
    fetcher.submit(formData, {
      method: 'post',
      action: '/cart',
    });

    onClick?.();
  };

  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => {
        return (
          <>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />
            <Button
              type="submit"
              onClick={(e) => handleClick(e, fetcher)}
              disabled={disabled ?? fetcher.state !== 'idle'}
            >
              {children}
            </Button>
          </>
        );
      }}
    </CartForm>
  );
}
