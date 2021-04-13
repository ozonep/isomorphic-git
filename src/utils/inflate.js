/* eslint-env node, browser */
/* global DecompressionStream */
export async function inflate(buffer) {
  return browserInflate(buffer)
}

async function browserInflate(buffer) {
  const ds = new DecompressionStream('deflate')
  const d = new Blob([buffer]).stream().pipeThrough(ds)
  return new Uint8Array(await new Response(d).arrayBuffer())
}
