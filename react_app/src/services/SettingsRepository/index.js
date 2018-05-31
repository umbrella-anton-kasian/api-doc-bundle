import Cache from '../Cache.js';

import * as EndpointsView from './settings/EndpointsView.js';
import * as JsonViewTheme from './settings/JsonViewTheme.js';
import * as JsonViewLength from './settings/JsonViewLength.js';

const settingsCacheKey = 'settings';

function getDefaultSettings() {
  return {
    [EndpointsView.name]: EndpointsView.defaultValue,
    [JsonViewTheme.name]: JsonViewTheme.defaultValue,
    [JsonViewLength.name]: JsonViewLength.defaultValue,
  };
};

export function getEndpointsView() {
  return load()[EndpointsView.name];
}
export function getEndpointsViewName() {
  return EndpointsView.name;
}
export function getEndpointsViewValues() {
  return EndpointsView.values;
}

export function getJsonViewTheme() {
  return load()[JsonViewTheme.name];
}
export function getJsonViewThemeName() {
  return JsonViewTheme.name;
}
export function getJsonViewThemeValues() {
  return JsonViewTheme.values;
}

export function getJsonViewLength() {
  return load()[JsonViewLength.name];
}
export function getJsonViewLengthName() {
  return JsonViewLength.name;
}
export function getJsonViewLengthValues() {
  return JsonViewLength.values;
}

export function save(settings = {}) {
  Cache.set(settingsCacheKey, JSON.stringify(settings));
  return settings;
}

export function load() {
  const settings = Cache.get(settingsCacheKey);
  if (settings) return JSON.parse(settings);
  return getDefaultSettings();
}