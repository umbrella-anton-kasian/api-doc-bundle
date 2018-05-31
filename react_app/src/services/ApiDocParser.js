import _ from 'lodash';

const INPUT_TYPE_STRING = 'string';
const INPUT_TYPE_INT = 'int';
const INPUT_TYPE_FILE = 'file';
const INPUT_TYPE_BOOL = 'bool';
const INPUT_TYPES = [
  INPUT_TYPE_STRING,
  INPUT_TYPE_INT,
  INPUT_TYPE_FILE,
  INPUT_TYPE_BOOL,
];

export {
  INPUT_TYPE_STRING,
  INPUT_TYPE_INT,
  INPUT_TYPE_FILE,
  INPUT_TYPE_BOOL,
  INPUT_TYPES,
};

function associateType(type) {
  switch (type) {

    case 'pub':
    case 'store':
    case 'public':
      return '[PUB]';

    case 'priv':
    case 'private':
      return '[PRIV]';

    case 'adm':
    case 'admin':
      return '[ADM]';

    case 'auth':
      return '[AUTH]';

    case 'dev':
      return '[DEV]';
  }

  return type;
}

export function buildType(ApiDoc) {
  const type = associateType(
    _.first(_.trimStart(ApiDoc.resource, '/').split('/'))
  );

  return {
    id: type,
    name: type,
    items: [],
  };
}

export function buildSection(ApiDoc) {
  const { section } = ApiDoc.annotation;

  return {
    id: section,
    name: section,
    items: [],
  };
}

export function buildApiDocItem(ApiDoc) {
  return {
    id: `${ApiDoc.annotation.method}-${ApiDoc.resource.replace(/[^a-zA-Z0-9]/g, '-')}`,
    name: `[${ApiDoc.annotation.method}] ${ApiDoc.resource}`,
    title: ApiDoc.annotation.description,
    item: ApiDoc,
    resource: ApiDoc.resource,
  };
}

export function buildMenuHierarchy(apiList) {
  const out = [];

  _.forEach(apiList, ApiDoc => {
    const section = buildSection(ApiDoc);
    const type = buildType(ApiDoc);
    const ApiDocItem = buildApiDocItem(ApiDoc);

    let typeIndex = _.findIndex(out, { id: type.id });
    if (typeIndex === -1) {
      typeIndex = out.length;
      out[typeIndex] = type;
    }

    let sectionIndex = _.findIndex(out[typeIndex].items, { id: section.id });
    if (sectionIndex === -1) {
      sectionIndex = out[typeIndex].items.length;
      out[typeIndex].items[sectionIndex] = section;
    }

    out[typeIndex].items[sectionIndex].items.push(ApiDocItem);
  });

  // sort
  _.map(out, typeAr => {
    _.map(typeAr.items, sectionAr => {
      _.sortBy(sectionAr.items, 'resource', 'asc');
      return sectionAr;
    });
    typeAr.items = _.sortBy(typeAr.items, 'name', 'asc');
    return typeAr;
  });

  return out;
}

export function getColorByApiDoc(ApiDoc) {
  return getColorByType(ApiDoc.annotation.method);
}

export function getColorByType(name) {
  switch(name) {

    case 'DELETE':
      return 'red';
    case 'POST':
      return 'green';
    case 'GET':
      return 'blue';
    case 'ANY':
      return 'gray';

    default:
      return 'silver';
  }
}

export function getInputType(fieldObj) {
  let type;

  switch (_.get(fieldObj, 'dataType')) {
    case 'file':
      type = INPUT_TYPE_FILE;
      break;

    case 'bool':
    case 'boolean':
      type = INPUT_TYPE_BOOL;
      break;

    case 'int':
    case 'integer':
    case 'float':
    case 'number':
      type = INPUT_TYPE_INT;
      break;

    case 'string':
    case 'STRING':
    case 'NULL':
    case 'datetime':
    case 'enum':
    default:
      type = INPUT_TYPE_STRING;
      break;
  }

  return type;
}

export function getUrlParams(url) {
  const urlParams = [];

  _.map(url.match(/{[^}]+}/g), urlParam => {
    const param = _.trim(urlParam, '{}');
    urlParams.push(param);
  });

  return urlParams;
}

export function formatUrl(url, params = {}) {
  _.forEach(url.match(/{[^}]+}/g), urlParam => {
    const param = _.trim(urlParam, '{}');
    const value = params[param] ? params[param] : '';

    url = url.replace(urlParam, value);
  });

  return url;
}

export function isDeprecated(ApiDoc) {
  return ApiDoc.annotation.deprecated;
}

function parseSwaggerParameters(params) {
  let result = {};
  _.forEach(params, (value) => {
    if(!value.required)
      result[value.name] = {
        dataType: value.type || 'string',
        description: value.description || '',
        required: value.required || false,
      };
  });

  return result;
}

function parseSwaggerRequirements(params) {
  let result = {};
  _.forEach(params, (value) => {
    if(value.required)
      result[value.name] = {
        dataType: value.type || 'string',
        description: value.description || '',
        required: value.required || false,
      };
  });

  return result;
}

export function parseSwaggerAnnotations(apiList) {
  let annotations = [];
  if(_.has(apiList, 'swagger')) {
    const paths = _.get(apiList, 'paths');
    _.forEach(paths, (contents, path) => {
      _.forEach(contents, (content, method) => {
        if(_.get(content, 'tags[0]')) {
          annotations.push({
            annotation: {
              section: _.get(content, 'tags[0]') || '',
              deprecated: _.get(content, 'deprecated') || false,
              description: _.get(content, 'summary'),
              documentation: _.get(content, 'summary'),
              method: method.toUpperCase(),
              filters: [],
              headers: [],
              requirements: _.has(content, 'parameters') ? parseSwaggerRequirements(_.get(content, 'parameters')) : [],
              parameters: _.has(content, 'parameters') ? parseSwaggerParameters(_.get(content, 'parameters')) : [],
              responses: _.has(content, 'responses') ? _.get(content, 'responses') : {},
            },
            resource: path,
          });
        }
      });
    });

    return annotations;
  } else {
    throw 'Cannot parse api list. Invalid format';
  }
}