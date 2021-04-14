var GitHttp = (function (exports) {
  'use strict';

  /**
   * @typedef {Object} GitProgressEvent
   * @property {string} phase
   * @property {number} loaded
   * @property {number} total
   */

  /**
   * @callback ProgressCallback
   * @param {GitProgressEvent} progress
   * @returns {void | Promise<void>}
   */

  /**
   * @typedef {Object} GitHttpRequest
   * @property {string} url - The URL to request
   * @property {string} [method='GET'] - The HTTP method to use
   * @property {Object<string, string>} [headers={}] - Headers to include in the HTTP request
   * @property {AsyncIterableIterator<Uint8Array>} [body] - An async iterator of Uint8Arrays that make up the body of POST requests
   * @property {ProgressCallback} [onProgress] - Reserved for future use (emitting `GitProgressEvent`s)
   * @property {object} [signal] - Reserved for future use (canceling a request)
   */

  /**
   * @typedef {Object} GitHttpResponse
   * @property {string} url - The final URL that was fetched after any redirects
   * @property {string} [method] - The HTTP method that was used
   * @property {Object<string, string>} [headers] - HTTP response headers
   * @property {AsyncIterableIterator<Uint8Array>} [body] - An async iterator of Uint8Arrays that make up the body of the response
   * @property {number} statusCode - The HTTP status code
   * @property {string} statusMessage - The HTTP status message
   */

  /**
   * @callback HttpFetch
   * @param {GitHttpRequest} request
   * @returns {Promise<GitHttpResponse>}
   */

  /**
   * @typedef {Object} HttpClient
   * @property {HttpFetch} request
   */

  async function collect(iterable) {
    let size = 0;
    const buffers = [];
    for await (let val of iterable) {
      buffers.push(val);
      size += val.byteLength;
    }
    const result = new Uint8Array(size);
    let nextIndex = 0;
    for (const buffer of buffers) {
      result.set(buffer, nextIndex);
      nextIndex += buffer.byteLength;
    }
    return result
  }

  // Convert a web ReadableStream (not Node stream!) to an Async Iterator
  // adapted from https://jakearchibald.com/2017/async-iterators-and-generators/
  function fromStream(stream) {
    // Use native async iteration if it's available.
    if (stream[Symbol.asyncIterator]) return stream
    const reader = stream.getReader();
    return {
      next() {
        return reader.read()
      },
      return() {
        reader.releaseLock();
        return {}
      },
      [Symbol.asyncIterator]() {
        return this
      },
    }
  }

  /* eslint-env browser */

  /**
   * HttpClient
   *
   * @param {GitHttpRequest} request
   * @returns {Promise<GitHttpResponse>}
   */
  async function request({
    onProgress,
    url,
    method = 'GET',
    headers = {},
    body,
  }) {
    // streaming uploads aren't possible yet in the browser
    if (body) {
      body = await collect(body);
    }
    const res = await fetch(url, { method, headers, body });
    const iter =
      res.body && res.body.getReader
        ? fromStream(res.body)
        : [new Uint8Array(await res.arrayBuffer())];
    // convert Header object to ordinary JSON
    headers = {};
    for (const [key, value] of res.headers.entries()) {
      headers[key] = value;
    }
    return {
      url: res.url,
      method: res.method,
      statusCode: res.status,
      statusMessage: res.statusText,
      body: iter,
      headers: headers,
    }
  }

  var index = { request };

  exports.default = index;
  exports.request = request;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
