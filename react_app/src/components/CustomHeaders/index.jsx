import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, FormControl, Button, Glyphicon } from 'react-bootstrap';

import * as CustomHeadersRepository from '../../services/CustomHeadersRepository.js';

import styles from './styles.css';

export default class CustomHeaders extends React.Component {

  constructor(props) {
    super(props);

    const headers = CustomHeadersRepository.load();

    this.state = {
      headers,
      newIndex: _.last(_.keys(headers)) + 1,
    };
  }

  updateState(newState) {
    this.setState(newState);
    this.props.onChange();
    CustomHeadersRepository.save(newState.headers);
  }

  handleValueChange(index, name, value) {
    const { headers } = this.state;
    headers[index][name] = value;

    this.updateState({
      ...this.state,
      headers,
    });
  }

  removeHeader(index) {
    const { headers } = this.state;
    delete headers[index];

    this.updateState({
      ...this.state,
      headers,
    });
  }

  addHeader() {
    const { headers, newIndex } = this.state;
    headers[newIndex] = {
      name: '',
      value: '',
    };

    this.updateState({
      ...this.state,
      headers,
      newIndex: newIndex + 1,
    });
  }

  renderHeader(header, index) {
    const { headers } = this.state;
    const { name, value } = header;
    const keys = _.keys(headers);
    const canDelete = keys.length > 1;
    const canAdd = index === _.last(keys);

    return (
      <Grid fluid={true} key={index} className="b-customHeader-line">
        <Row>
          <Col xs={12} md={4}>
            <FormControl
              bsSize="sm"
              defaultValue={ name }
              placeholder="header name"
              onChange={ proxy => this.handleValueChange(index, 'name', proxy.nativeEvent.target.value) }
            />
          </Col>
          <Col xs={12} md={5}>
            <FormControl
              bsSize="sm"
              defaultValue={ value }
              placeholder="header value"
              onChange={ proxy => this.handleValueChange(index, 'value', proxy.nativeEvent.target.value) }
            />
          </Col>
          <Col xs={12} md={3}>
            { canDelete && <Button bsStyle="danger" bsSize="sm" onClick={() => this.removeHeader(index)}><Glyphicon glyph="minus"/></Button> }
            { canDelete && canAdd && <span>&nbsp;</span> }
            { canAdd && <Button bsStyle="primary" bsSize="sm" onClick={() => this.addHeader()}><Glyphicon glyph="plus"/></Button> }
          </Col>
        </Row>
      </Grid>
    );
  }

  renderHeaders() {
    const { headers } = this.state;
    return _.map(headers, (header, index) => this.renderHeader(header, index, headers.length));
  };

  render() {
    return (
      <div>
        { this.renderHeaders() }
      </div>
    );
  }
}

CustomHeaders.propTypes = {
  onChange: PropTypes.func.isRequired,
};