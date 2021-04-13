/* eslint-env node, browser */
/* global CompressionStream */
export async function deflate(buffer) {
  return browserDeflate(buffer)
}

async function browserDeflate(buffer) {
  const cs = new CompressionStream('deflate')
  const c = new Blob([buffer]).stream().pipeThrough(cs)
  return new Uint8Array(await new Response(c).arrayBuffer())
}
