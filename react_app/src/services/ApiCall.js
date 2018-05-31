import { getApiDomain, applyQueryParams } from './url.js';
import dataTransformer from './dataTransformer.js';
import * as CustomHeadersRepository from './CustomHeadersRepository.js';

const apiDomain = getApiDomain();

function getHeaders(responseHeaders) {
  const headers = {};
  for (let key of responseHeaders.keys()) {
    headers[key] = responseHeaders.get(key);
  }
  return headers;
}

function getBaseParams() {
  const headers = new Headers();
  const customHeaders = CustomHeadersRepository.load();

  _.map(customHeaders, header => {
    if (header.name) headers.append(header.name, header.value)
  });

  return {
    headers,
    credentials: 'include',
    cache: 'no-cache',
    mode: 'cors',
    body: undefined,
  };
}

function callAPI(url, params) {
  const apiParams = {
    ...getBaseParams(),
    ...params,
  };

  return new Promise((resolve, reject) => {
    const fullUrl = `${apiDomain}${url}`;
    let objResponse = null;
    fetch(fullUrl, apiParams)
      .then(response => {
        objResponse = response;
        return response.text();
      })
      .then(data => {
        try { data = JSON.parse(data); } catch (e) {}
        resolve({
          data,
          headers: getHeaders(objResponse.headers),
          status: objResponse.status,
          url,
        });
      })
      .catch(reject);
  });
}

export function POST(url, originData) {
  const params = {
    method: 'POST',
    body: originData ? dataTransformer.transformData(originData) : undefined,
  };

  return callAPI(url, params);
}

export function GET(url, originData) {
  const urlWithParams = applyQueryParams(url, originData);
  const params = {
    method: 'GET',
  };

  return callAPI(urlWithParams, params);
}

export function DELETE(url, originData) {
  const params = {
    method: 'DELETE',
    body: originData ? dataTransformer.transformData(originData) : undefined,
  };

  return callAPI(url, params);
}
