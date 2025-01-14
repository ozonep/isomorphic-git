import { GitObject } from '../models/GitObject.js'
import { shasum } from '../utils/shasum.js'

export function hashObject({ gitdir, type, object }) {
  return shasum(GitObject.wrap({ type, object }))
}
