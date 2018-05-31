import _ from 'lodash';

import Cache from './Cache';
import * as ApiDocParser from './ApiDocParser';

const presetsListCacheKey = 'fields-presets';

export function getDefaultFieldset() {
  return {
    requirements: {
      title: 'Requirements:',
      items: [],
    },
    filters: {
      title: 'Filters:',
      items: [],
    },
    parameters: {
      title: 'Parameters:',
      items: [],
    },
  };
}

export function save(presets) {
  const presetsToSave = _.clone(presets);

  _.forEach(presetsToSave, (group, groupId) => {
    _.forEach(group.items, (item, itemId) => {
      if (item.type === ApiDocParser.INPUT_TYPE_FILE) {
        presetsToSave[groupId][itemId].value = '';
      }
    });
  });

  Cache.set(presetsListCacheKey, JSON.stringify(presetsToSave));
  return presets;
}

export function getFormId(ApiDoc) {
  return ApiDocParser.buildApiDocItem(ApiDoc).name;
}

export function load() {
  const presets = Cache.get(presetsListCacheKey);
  return presets ? presets : '{}';
}

export function list() {
  const presets = load();
  if (presets) return JSON.parse(presets);
  return {};
}

export function listForms() {
  const presets = list();
  return _.keys(presets);
}

export function addByApiDoc(ApiDoc, name, preset) {
  const presets = list();
  const formId = getFormId(ApiDoc);

  if (_.isEmpty(presets[formId])) presets[formId] = {};

  presets[formId][name] = preset;

  save(presets);
}

export function getByFormId(formId) {
  const presets = list();

  if (!presets[formId]) return {};

  return presets[formId];
}

export function getByApiDoc(ApiDoc) {
  const formId = getFormId(ApiDoc);

  return getByFormId(formId);
}

export function getPresetByFormId(formId, presetName) {
  const presets = getByFormId(formId);

  if (!presets[presetName]) return {};

  return presets[presetName];
}

export function deleteForm(formId) {
  const presets = list();

  delete presets[formId];
  save(presets);
}

export function deletePreset(formId, presetId) {
  const presets = list();

  if (presets[formId]) {
    delete presets[formId][presetId];
    save(presets);
  }
}

export function hasFormId(formId) {
  const presets = list();

  return _.keys(presets).indexOf(formId) !== -1;
}