export function getThreadPublicId(uri: string) {
  const url = uri.split('/');
  const filePath = url.slice(-2).join('/');
  const public_id = filePath.replace(/(\.[^.]+)+$/, '');
  return public_id;
}
