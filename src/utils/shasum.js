/* eslint-env browser */
import {createHash} from "sha1-uint8array";

export function shasum(buffer) {
  return createHash().update(buffer).digest("hex");
}
