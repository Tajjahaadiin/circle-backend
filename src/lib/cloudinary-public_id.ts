export function getThreadPublicId(uri: string) {
  const url = uri.split('/');
  console.log('url', url);
  const filePath = url.slice(-2).join('/');
  console.log('filepath', filePath);
  const public_id = filePath.replace(/(\.[^.]+)+$/, '');
  return public_id;
}
