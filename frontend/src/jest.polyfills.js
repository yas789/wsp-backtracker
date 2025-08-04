/**
 * @note The block below contains polyfills for Node.js globals
 * required for Jest to function when running JSDOM tests.
 * These HAVE to be require's and HAVE to be in this exact
 * order, since "undici" depends on the "TextEncoder" global API.
 */

const { TextDecoder, TextEncoder } = require('node:util')

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
})

// BroadcastChannel polyfill for MSW
global.BroadcastChannel = global.BroadcastChannel || class BroadcastChannel {
  constructor(name) {
    this.name = name;
  }
  
  postMessage(message) {
    // No-op for testing
  }
  
  addEventListener(type, listener) {
    // No-op for testing
  }
  
  removeEventListener(type, listener) {
    // No-op for testing
  }
  
  close() {
    // No-op for testing
  }
};

// TransformStream polyfill for MSW
global.TransformStream = global.TransformStream || class TransformStream {
  constructor(transformer = {}) {
    this.readable = new ReadableStream();
    this.writable = new WritableStream();
  }
};

// ReadableStream polyfill for MSW
global.ReadableStream = global.ReadableStream || class ReadableStream {
  constructor(source = {}) {
    this.locked = false;
  }
  
  getReader() {
    return {
      read: () => Promise.resolve({ done: true, value: undefined }),
      releaseLock: () => {},
      closed: Promise.resolve()
    };
  }
};

// WritableStream polyfill for MSW
global.WritableStream = global.WritableStream || class WritableStream {
  constructor(sink = {}) {
    this.locked = false;
  }
  
  getWriter() {
    return {
      write: (chunk) => Promise.resolve(),
      close: () => Promise.resolve(),
      abort: (reason) => Promise.resolve(),
      releaseLock: () => {},
      closed: Promise.resolve()
    };
  }
};

// Simple fetch polyfill for MSW compatibility
global.fetch = global.fetch || function() {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  });
};

// Basic Request/Response polyfills
global.Request = global.Request || class Request {
  constructor(url, options = {}) {
    this.url = url;
    this.method = options.method || 'GET';
    this.headers = options.headers || {};
  }
};

global.Response = global.Response || class Response {
  constructor(body, options = {}) {
    this.body = body;
    this.status = options.status || 200;
    this.ok = this.status >= 200 && this.status < 300;
  }
  
  json() {
    return Promise.resolve(JSON.parse(this.body));
  }
  
  text() {
    return Promise.resolve(this.body);
  }
};
