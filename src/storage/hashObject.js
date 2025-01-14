import { GitObject } from '../models/GitObject.js'
import { shasum } from '../utils/shasum.js'

export function hashObject({
  type,
  object,
  format = 'content',
  oid = undefined,
}) {
  if (format !== 'deflated') {
    if (format !== 'wrapped') {
      object = GitObject.wrap({ type, object })
    }
    oid = shasum(object)
  }
  return { oid, object }
}
