import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

import _ from 'lodash';

import styles from './styles.css';

export default class FieldsTable extends React.Component {

  render() {
    const { fields } = this.props;

    return ( !_.isEmpty(fields) &&
      <Table bordered condensed className="b-fields-table">
        <thead>
          <tr><th>Name</th><th>Type</th><th>Value</th></tr>
        </thead>
        {
          _.map(fields, (group, groupKey) => ( group.items.length > 0 &&
            <tbody key={groupKey}>
              <tr><th colSpan="3" className="b-fields-table-group">{ group.title }</th></tr>
              {
                _.map(group.items, (item, itemKey) => (
                  <tr key={itemKey}><td>{ item.name }</td><td>{ item.type }</td><td>{ item.value }</td></tr>
                ))
              }
            </tbody>
          ))
        }
      </Table>
    );
  }
}

FieldsTable.propTypes = {
  fields: PropTypes.object.isRequired,
};