import path from 'path';

export function generateCustomFilename(
  originalFilename: string,
  prefix: string = 'image',
): string {
  const now = new Date();
  const dateString = now.toISOString().slice(0, 10); // YYYY-MM-DD format
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
  const fileExtension = path.extname(originalFilename); // Get extension using path.extname

  return `${prefix}-${dateString}-${uniqueSuffix}${fileExtension}`;
}
