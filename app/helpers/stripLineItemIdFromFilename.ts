/**
 * Remove a leading numeric ID and any following " - " (or "-") from a filename.
 *
 * @param filename  The raw filename returned by the upstream service
 * @param numericId The numeric ID you want removed from the front
 * @returns         The filename with the ID and separator stripped off
 */
export function stripLineItemIdFromFilename(
    filename: string,
    numericId: string
  ): string {
    // Build a regex that matches:
    //   ^<numericId>\s*-\s*     (ID, then optional spaces, a dash, optional spaces)
    // or
    //   ^<numericId>\s+         (ID, then at least one space)
    const regex = new RegExp(
      `^${numericId}\\s*(?:-\\s*|\\s+)`
    );
  
    return filename.replace(regex, '');
  }
  