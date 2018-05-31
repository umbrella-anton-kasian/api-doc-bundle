import React, { Component } from 'react';
import { PanelGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ApiDoc from '../../../models/ApiDoc.js';
import Endpoint from '../../Endpoint/index.jsx';
import Fieldset from '../../Fieldset/index.jsx';
import DeprecatedLabel from '../../DeprecatedLabel/index.jsx';
import * as ApiDocParser from '../../../services/ApiDocParser';

export default class Accordion extends React.Component {

  renderEndpoint(ApiDocItem) {
    const color = ApiDocParser.getColorByApiDoc(ApiDocItem.item);
    let labelsHtml = null;

    if(ApiDocParser.isDeprecated(ApiDocItem.item)) labelsHtml = <DeprecatedLabel/>;

    return (
      <Fieldset
        openable
        color={color}
        id={ApiDocItem.id}
        opened={this.props.isOpened(ApiDocItem.id)}
        key={ApiDocItem.id}
        title={ApiDocItem.name}
        subtitle={ApiDocItem.title}
        renderBody={ () => <Endpoint ApiDoc={ApiDocItem.item} formId={ApiDocItem.id} /> }
        onToggle={ opened => { this.props.updateOpenFlag(ApiDocItem.id, opened); } }
        renderLabels={ () => labelsHtml }
      />
    );
  }

  renderSection(section) {
    const color = ApiDocParser.getColorByType();

    return (
      <Fieldset
        openable
        color={color}
        id={section.id}
        opened={this.props.isOpened(section.id)}
        key={section.id}
        title={section.name}
        renderBody={ () => _.map(section.items, ApiDocItem => (this.renderEndpoint(ApiDocItem))) }
        onToggle={ opened => { this.props.updateOpenFlag(section.id, opened); } }
      />
    );
  }

  renderType(type) {
    const color = ApiDocParser.getColorByType();

    return (
      <Fieldset
        openable
        color={color}
        id={type.id}
        opened={this.props.isOpened(type.id)}
        key={type.id}
        title={type.name}
        renderBody={ () => _.map(type.items, section => (this.renderSection(section))) }
        onToggle={ opened => { this.props.updateOpenFlag(type.id, opened); } }
      />
    );
  }

  render() {
    const menuList = ApiDocParser.buildMenuHierarchy(this.props.apiList);

    return (
      <PanelGroup>
        { _.map(menuList, type => (this.renderType(type))) }
      </PanelGroup>
    );
  }
}

Accordion.propTypes = {
  apiList: PropTypes.arrayOf(ApiDoc),
  updateOpenFlag: PropTypes.func,
  isOpened: PropTypes.func,
};
