import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-bootstrap';

import _ from 'lodash';

import JsonView from '../../JsonView/index.jsx';

export default class EndpointResponse extends React.Component {

  render() {
    const { response } = this.props;
    const data = _.get(response, 'data');
    const headers = _.get(response, 'headers');
    const status = _.get(response, 'status');

    return (
      <div>
        { data &&
          <Grid fluid={true}>
            <Row>
              <Col xs={12} md={12}>
                <h4>Response status:</h4>
                <JsonView data={status}/>

                <h4>Response data:</h4>
                <JsonView data={data} opened/>

                <h4>Response headers:</h4>
                <JsonView data={headers}/>
              </Col>
            </Row>
          </Grid>
        }
      </div>
    );
  }
}

EndpointResponse.propTypes = {
  response: PropTypes.object,
};