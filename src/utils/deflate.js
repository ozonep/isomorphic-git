/* eslint-env browser */
import {zlibSync} from 'fflate';

export function deflate(buffer) {
  return zlibSync(buffer, {})
}
