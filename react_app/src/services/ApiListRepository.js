import _ from 'lodash';
import axios from 'axios';

import * as ApiDocParser from './ApiDocParser.js';
import Cache from './Cache.js';
import DefinitionsRepository from './DefinitionsRepository.js';
import { getApiDomain } from './url.js';

const apiDomain = getApiDomain();
const buildInfoCacheKey = 'buildInfo';
const apiListCacheKey = 'apiList';

function getBuildJson() {
  return axios({
    method: 'get',
    url: `${apiDomain}/build.json`,
  }).then(response => _.get(response, 'data.meta.HTTP_ERR') === 404 ? null : _.get(response, 'data'));
}

function getApiJson() {
  return axios({
    method: 'get',
    url: `${apiDomain}/adm/api/json`,
  }).then(response => response.data.response);
}

function getApiList(force = false) {
  const apiList = force ? null : Cache.get(apiListCacheKey);

  if (!_.isNull(apiList))
    return new Promise(resolve => resolve(apiList));

  return getApiJson().then(apiList => {
    let annotations = [];
    // need to parse api list?
    if(_.has(apiList, 'swagger')) {
      if(_.isNull(DefinitionsRepository.getAll()) && _.has(apiList, 'definitions'))
        DefinitionsRepository.save(_.get(apiList, 'definitions'));

      annotations = ApiDocParser.parseSwaggerAnnotations(apiList);
    } else {
        annotations = apiList;
    }

    Cache.set(apiListCacheKey, annotations);
    return annotations;
  });
}

function checkBuildInfo(buildInfo) {
  const oldBuildInfo = Cache.get(buildInfoCacheKey);
  Cache.set(buildInfoCacheKey, buildInfo);

  return _.isNull(oldBuildInfo) || (buildInfo['Build ID'] !== oldBuildInfo['Build ID']);
}

export function get() {
  return getBuildJson().then(
    buildInfo => getApiList(checkBuildInfo(buildInfo)),
    () => getApiList()
  );
}