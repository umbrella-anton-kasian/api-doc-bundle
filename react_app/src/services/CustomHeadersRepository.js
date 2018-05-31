import Cache from './Cache.js';

const customHeadersCacheKey = 'custom-headers';
const defaultHeaders = {
  0: {
    name: 'X-Auth-Token',
    value: '',
  },
};

export function save(customHeaders = {}) {
  Cache.set(customHeadersCacheKey, JSON.stringify(customHeaders));
  return customHeaders;
}

export function load() {
  const customHeaders = Cache.get(customHeadersCacheKey);
  if (customHeaders) return JSON.parse(customHeaders);
  return defaultHeaders;
}