import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JSONTree from 'react-json-tree';

import * as SettingsRepository from '../../services/SettingsRepository';

import styles from './styles.css';

export default class JsonView extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { data, opened } = this.props;
    const isJson = typeof data === 'object';
    let { theme, showKeys } = this.props;
    if (_.isEmpty(theme)) theme = SettingsRepository.getJsonViewTheme();
    if (_.isNull(showKeys)) showKeys = SettingsRepository.getJsonViewLength();

    const params = {
      data,
      theme,
      hideRoot: true,
      shouldExpandNode: () => opened,
    };

    if (_.isNull(showKeys) || !showKeys) params.getItemString = (type, data, itemType, itemString) => '';

    return (
      <div className="b-json-tree-wrapper" style={{backgroundColor: theme.base00}}>
        { !isJson && <div className="b-json-tree-text" style={{color: `${theme.base0B}`}}>{ data }</div> }
        { isJson && <JSONTree { ...params } /> }
      </div>
    );
  }
}

JsonView.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.object
  ]),
  opened: PropTypes.bool,
  showKeys: PropTypes.bool,
  theme: PropTypes.object,
};

JsonView.defaultProps = {
  opened: false,
  showKeys: null,
};