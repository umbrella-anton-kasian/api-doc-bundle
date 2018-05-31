import * as JsonViewThemes from './JsonViewThemes';

import _ from 'lodash';

const name = 'JsonViewTheme';

const values = JsonViewThemes;

const defaultValue = _.find(JsonViewThemes, { scheme: 'apathy' });

export {
  name,
  values,
  defaultValue,
};
