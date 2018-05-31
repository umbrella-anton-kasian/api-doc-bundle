import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ApiDoc from '../../models/ApiDoc.js';
import * as SettingsRepository from '../../services/SettingsRepository';
import Accordion from './Accordion/index.jsx';
import Single from './Single/index.jsx';

export default class EndpointsView extends React.Component {

  constructor(props) {
    super(props);

    const { apiList, current } = this.props;

    this.state = {
      viewType: SettingsRepository.getEndpointsView(),
      apiList,
      currentIndex: '',
      current,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.state,
      apiList: nextProps.apiList,
      current: nextProps.current,
    });
  }

  renderAccordionEndpointView() {
    const { apiList } = this.state;

    return (
      <Accordion
        apiList={apiList}
        updateOpenFlag={(index, opened) => { this.props.updateOpenFlag(index, opened) }}
        isOpened={index => this.props.isOpened(index) }
      />
    );
  }

  renderSingleEndpointView() {
    const { apiList, current } = this.state;

    return (
      <Single
        apiList={apiList}
        current={current}
      />
    );
  }

  render() {
    const type = this.state.viewType;

    switch (type) {
      case SettingsRepository.getEndpointsViewValues().TYPE_ACCORDION:
        return this.renderAccordionEndpointView();
      case SettingsRepository.getEndpointsViewValues().TYPE_SINGLE:
      default:
        return this.renderSingleEndpointView();
    }
  }
}

EndpointsView.propTypes = {
  apiList: PropTypes.arrayOf(ApiDoc),
  updateOpenFlag: PropTypes.func,
  isOpened: PropTypes.func,
  current: PropTypes.string,
};
