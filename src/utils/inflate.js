/* eslint-env node, browser */
import {decompressSync} from 'fflate';

export function inflate(buffer) {
  return decompressSync(buffer)
}
