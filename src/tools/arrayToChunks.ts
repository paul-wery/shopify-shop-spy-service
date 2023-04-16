export function arrayToChunks<T>(array: T[], chunkSize: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < array.length; index += chunkSize) {
    const chunk = array.slice(index, index + chunkSize);

    chunks.push(chunk);
  }
  return chunks;
}
