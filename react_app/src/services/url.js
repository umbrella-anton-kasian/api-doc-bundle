import _ from 'lodash';

import __PARAMETERS__ from '../../parameters.json';

const hostname = window.location.hostname;

export function getApiDomain() {
  const domainMap = __PARAMETERS__.domains.api;

  if (!(hostname in domainMap)) return '';

  return `${window.location.protocol}//${domainMap[hostname]}`;
}

export function getStompDomain() {
  const domainMap = __PARAMETERS__.domains.stomp;

  if (!(hostname in domainMap)) return '';

  return `${window.location.protocol}//${domainMap[hostname]}`;
}

export function applyQueryParams(url, query) {

  if (!_.keys(query).length) return url;

  const newParams = [];
  const newUrl = url.indexOf('?') === -1 ? `${url}?` : url;

  _.map(query, (v, k) => {
    const value = v ? encodeURIComponent(v) : '';
    newParams.push(`${k}=${value}`)
  });

  return `${newUrl}${newParams.join('&')}`;
}