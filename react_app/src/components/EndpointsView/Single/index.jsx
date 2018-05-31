import React, { Component } from 'react';
import { PanelGroup, ListGroup, ListGroupItem, Label } from 'react-bootstrap';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ApiDoc from '../../../models/ApiDoc.js';
import Endpoint from '../../Endpoint/index.jsx';
import Fieldset from '../../Fieldset/index.jsx';
import DeprecatedLabel from '../../DeprecatedLabel/index.jsx';
import * as ApiDocParser from '../../../services/ApiDocParser';

export default class Single extends React.Component {

  static renderEmptyEndpoint() {
    return (
      <ListGroup>
        <ListGroupItem bsStyle="warning">Please select endpoint</ListGroupItem>
      </ListGroup>
    );
  }

  getApiDocItem() {
    const { apiList, current } = this.props;
    let foundApiDocItem = null;

    _.forEach(apiList, ApiDoc => {
      const ApiDocItem = ApiDocParser.buildApiDocItem(ApiDoc);
      if (ApiDocItem.id === current) foundApiDocItem = ApiDocItem;
    });

    return foundApiDocItem;
  }

  renderEndpoint(ApiDocItem) {
    const color = ApiDocParser.getColorByApiDoc(ApiDocItem.item);
    let labelsHtml = null;

    if (ApiDocParser.isDeprecated(ApiDocItem.item)) labelsHtml = <DeprecatedLabel/>;

    return (
      <PanelGroup>
        <Fieldset
          opened
          id={`id-${ApiDocItem.id}`}
          color={color}
          key={ApiDocItem.id}
          title={ApiDocItem.name}
          subtitle={ApiDocItem.title}
          renderBody={ () => <Endpoint ApiDoc={ApiDocItem.item} formId={ApiDocItem.id} /> }
          renderLabels={ () => labelsHtml }
        />
      </PanelGroup>
    );
  }

  render() {
    const ApiDocItem = this.getApiDocItem();

    if (ApiDocItem) return this.renderEndpoint(ApiDocItem);
    return Single.renderEmptyEndpoint();
  }
}

Single.propTypes = {
  apiList: PropTypes.arrayOf(ApiDoc),
  current: PropTypes.string,
};
