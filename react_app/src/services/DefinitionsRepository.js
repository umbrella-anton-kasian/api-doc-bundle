import Cache from './Cache.js';
import _ from 'lodash';

const definitionsCacheKey = 'definitions';

export default class DefinitionsRepository {
  static save(definitions = {}) {
    Cache.set(definitionsCacheKey, JSON.stringify(definitions));
  }

  static getAll() {
    const definitions = Cache.get(definitionsCacheKey);
    return definitions ? JSON.parse(definitions) : null;
  }

  static getDefinitionNameFromLink(definitionLink) {
    const parts = definitionLink.split('/');
    return parts[parts.length-1];
  }

  static get(definition) {
    const definitionName = DefinitionsRepository.getDefinitionNameFromLink(definition);
    const definitions = DefinitionsRepository.getAll();
    return _.has(definitions, definitionName) ? _.get(definitions, `${definitionName}.properties`) : null;
  }

  static parseModel(model) {
    let result = {};
    _.forEach(model, (value, key) => {
      if(key === '$ref') {
        result[DefinitionsRepository.getDefinitionNameFromLink(value)]
          = DefinitionsRepository.parseModel(DefinitionsRepository.get(value));
      } else {
        if(_.isObject(value))
          result[key] = DefinitionsRepository.parseModel(value);
        else
          result[key] = value;
      }
    });

    return result;
  }
}
