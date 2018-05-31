import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'react-bootstrap';

import ApiDoc from '../../models/ApiDoc.js';

import EndpointDocumentation from "./EndpointDocumentation/index.jsx";
import EndpointForm from './EndpointForm/index.jsx';
import EndpointResponse from './EndpointResponse/index.jsx';

import styles from './styles.css';

export default class Endpoint extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      response: null,
    };
  }

  setResponse(response) {
    this.setState({
      ...this.state,
      response,
    });
  }

  render() {
    const { response } = this.state;
    const { ApiDoc, formId } = this.props;

    return (
      <Tabs defaultActiveKey={2} id={`${formId}-tabs`} className="b-endpoint-tabs">
        <Tab eventKey={1} className='tabContentAnnotation' title="Documentation">
            <EndpointDocumentation ApiDoc={ApiDoc}/>
        </Tab>
        <Tab eventKey={2} className='tabContentSandbox' title='Sandbox'>
          <EndpointForm
            ApiDoc={ApiDoc}
            formId={formId}
            onResponse={ data => this.setResponse(data) }
          />
          <EndpointResponse response={response} />
        </Tab>
      </Tabs>
    );
  }
}

Endpoint.propTypes = {
  ApiDoc: ApiDoc.isRequired,
  formId: PropTypes.string.isRequired,
};