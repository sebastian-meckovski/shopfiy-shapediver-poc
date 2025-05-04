export function extractLineItemId(gid: string): string | null {
    const match = gid.match(/gid:\/\/shopify\/LineItem\/(\d+)$/);
    if (match) {
      return match[1]; // Return the numeric ID
    }
    return null; // Return null if no match is found
  }
  