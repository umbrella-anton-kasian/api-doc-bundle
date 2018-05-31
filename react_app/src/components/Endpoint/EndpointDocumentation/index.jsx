import React, { Component } from 'react';
import showdown from 'showdown';
import { Table } from 'react-bootstrap';
import _ from 'lodash';

import ApiDoc from '../../../models/ApiDoc.js';
import JsonView from '../../JsonView/index.jsx';
import DefinitionsRepository from './../../../services/DefinitionsRepository.js';

export default class EndpointDocumentation extends React.Component {

  getAnnotation() {
    const { ApiDoc } = this.props;
    const text = ApiDoc.annotation.documentation;

    const converter = new showdown.Converter();
    return converter.makeHtml(text);
  }

  static renderBodyRows(responses) {
    return _.map(responses, (item, code) => (
      <tr key={`row-${code}`}>
        <td>{code}</td>
        <td>
          <p>{item.description}</p>
          { _.has(item, 'schema') &&
            <JsonView data={DefinitionsRepository.parseModel(item.schema)} />
          }
        </td>
      </tr>
    ));
  }

  render() {
    const { ApiDoc } = this.props;
    const responses = _.get(ApiDoc, 'annotation.responses');

    return (
      <div>
        { _.has(ApiDoc, 'annotation.documentation') &&
          <p>
              {ApiDoc.annotation.documentation}
          </p>
        }
        <hr/>
        { responses &&
          <div>
            <Table>
              <thead>
              <tr>
                <th>Code</th>
                <th>Description</th>
              </tr>
              </thead>
              <tbody>
                {EndpointDocumentation.renderBodyRows(responses)}
              </tbody>
            </Table>
          </div>
        }
      </div>
    );
  }
}

EndpointDocumentation.propTypes = {
  ApiDoc: ApiDoc.isRequired,
};