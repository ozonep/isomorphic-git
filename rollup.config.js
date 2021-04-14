import fs from 'fs'
import path from 'path'

import pkg from './package.json'

const external = [
  'fs',
  'path',
  'crypto',
  'stream',
  'crc/lib/crc32.js',
  'sha.js/sha1',
  'sha.js/sha1.js',
  ...Object.keys(pkg.dependencies),
]

// Modern modules
const ecmaConfig = (input, output) => ({
  input: `src/${input}`,
  external: [...external],
  output: [
    {
      format: 'es',
      file: `${output}`,
    },
  ],
})

// Script tags that "export" a global var for those browser environments that
// still don't support `import` (Workers and ServiceWorkers)
const umdConfig = (input, output, name) => ({
  input: `src/${input}`,
  output: [
    {
      format: 'iife',
      file: `${output}`,
      name,
      exports: 'named',
    },
  ],
})

const template = (umd) =>
  JSON.stringify(
    {
      type: 'module',
      main: 'index.js',
      module: 'index.js',
      typings: 'index.d.ts',
      unpkg: umd ? 'index.umd.js' : undefined,
    },
    null,
    2
  )

const pkgify = (input, output, name) => {
  fs.mkdirSync(path.join(__dirname, output), { recursive: true })
  fs.writeFileSync(
    path.join(__dirname, output, 'package.json'),
    template(!!name)
  )
  return [
    ecmaConfig(`${input}/index.js`, `${output}/index.js`),
    ...(name
      ? [umdConfig(`${input}/index.js`, `${output}/index.umd.js`, name)]
      : []),
  ]
}

export default [
  ecmaConfig('index.js', 'index.js'),
  ecmaConfig('internal-apis.js', 'internal-apis.js'),
  ...pkgify('http', 'http', 'GitHttp'),
]
