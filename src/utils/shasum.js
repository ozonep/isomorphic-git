/* eslint-env browser */
import { toHex } from './toHex.js'

export async function shasum(buffer) {
  const hash = await crypto.subtle.digest('SHA-1', buffer)
  return toHex(hash)
}
