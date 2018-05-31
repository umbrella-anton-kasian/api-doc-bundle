import _ from 'lodash';

const DataTransformer = {
  /**
   * Check properties 'lastModified' and 'type' to verify that it is a file
   *
   * @param Object value
   * @return Boolean
   */
  isFile: value => _.isObject(value) && value.lastModified && _.isString(value.type),

  /**
   * @param Object|Array originData
   * @param String prefix
   * @return FormData
   */
  transformData: (originData, prefix = '') => {
    const formPath = prefix ? `[${prefix}]` : '';
    const formData = new FormData();

    function addDataToForm(value, key, path = '') {
      const currentPath = path ? `${path}[${key}]` : key;

      if (value === null || value === undefined) {
        formData.append(currentPath, '');
      } else if (DataTransformer.isFile(value)) {
        formData.append(currentPath, value);
      } else if (_.isArray(value) || _.isObject(value)) {
        _.forEach(value, (subValue, subKey) => {
          addDataToForm(subValue, subKey, currentPath);
        });
      } else {
        formData.append(currentPath, value);
      }
    }

    _.forEach(originData, (value, key) => {
      addDataToForm(value, key, formPath);
    });

    return formData;
  },
};

export default DataTransformer;
