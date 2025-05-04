// app/routes/download.tsx
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { stripLineItemIdFromFilename } from '~/helpers/stripLineItemIdFromFilename';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const numericId = url.searchParams.get('lineItem');
  if (!numericId) {
    throw new Response('Missing lineItem query param', { status: 400 });
  }

  // Fetch the file from your private service
  const fileUrl = `https://shopify-orders-service.sebastian-meckovski.com/shopify/orders/${numericId}/file`;
  const upstreamRes = await fetch(fileUrl);
  if (!upstreamRes.ok) {
    throw new Response('Upstream error fetching file', { status: 502 });
  }

  // Pull binary payload
  const arrayBuffer = await upstreamRes.arrayBuffer();

  // MUST have a Content-Disposition from upstream
  const upstreamContentDisp = upstreamRes.headers.get('content-disposition');
  if (!upstreamContentDisp) {
    throw new Response(
      'Upstream did not set Content-Disposition header',
      { status: 502 }
    );
  }

  // Extract the raw filename from the header
  // e.g. upstreamContentDisp === 'attachment; filename="345347... - Name.ext"'
  const filenameMatch = upstreamContentDisp.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  if (!filenameMatch) {
    throw new Response(
      'Could not parse filename from Content-Disposition',
      { status: 502 }
    );
  }
  const rawFilename = filenameMatch[1];

  // Strip the leading ID + separator
  const cleanFilename = stripLineItemIdFromFilename(rawFilename, numericId);

  // Rebuild our own Content-Disposition
  const contentDisp = `attachment; filename="${cleanFilename}"`;

  return new Response(arrayBuffer, {
    headers: {
      'Content-Type': upstreamRes.headers.get('content-type') ?? 'application/octet-stream',
      'Content-Disposition': contentDisp,
    },
  });
}
