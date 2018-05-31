import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Form, FormGroup, FormControl, Button, Glyphicon, SplitButton, MenuItem, OverlayTrigger, Tooltip } from 'react-bootstrap';

import _ from 'lodash';

import ApiDoc from '../../../models/ApiDoc';
import * as ApiDocParser from '../../../services/ApiDocParser';
import * as ApiCall from '../../../services/ApiCall';
import * as FieldPresetRepository from '../../../services/FieldPresetRepository';
import Loading from './../Loading/index.jsx';
import PresetsControls from './PresetsControls/index.jsx';

import styles from './styles.css';

export default class EndpointForm extends React.Component {

  constructor(props) {
    super(props);

    const { ApiDoc } = this.props;

    let method = ApiDoc.annotation.method;
    if (method === 'ANY') method = 'GET';

    const fields = this.getApiDocFields();

    this.state = {
      fieldsChanged: false,
      fields,
      isLoading: false,
      url: ApiDoc.resource,
      method,
    };
  }

  getUniqId() {
    let d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
      d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  getApiDocFields() {
    const { ApiDoc } = this.props;
    const fields = FieldPresetRepository.getDefaultFieldset();

    _.each(fields, (params, type) => {
      _.map(ApiDoc.annotation[type], (field, name) => {
        if (!this.findField(fields, name, 'name')) {
          fields[type].items.push(
            this.getFieldByEndpoint(name, field)
          );
        }
      });
    });

    return fields;
  }

  addEmptyField(groupIndex) {
    const { fields } = this.state;

    fields[groupIndex].items.push(
      this.buildField('', ApiDocParser.INPUT_TYPE_STRING, '', '', '')
    );

    this.setFields(fields);
  };

  setFields(fields, fieldsChanged = true) {
    this.setState({
      ...this.state,
      fields,
      fieldsChanged,
    });
  }

  resetFields() {
    this.setFields(this.getApiDocFields(), false);
  }

  removeField(id) {
    const { fields } = this.state;
    let index = null;
    let type = null;

    _.forEach(fields, (group, groupKey) => {
      _.forEach(group.items, (field, fieldKey) => {
        if(field.id === id) {
          type = groupKey;
          index = fieldKey;
        }
      });
    });

    if (!_.isNull(index) && !_.isNull(type)) {
      fields[type].items.splice(index, 1);
    }

    this.setFields(fields);
  };

  buildField(name, type, placeholder, value, help) {
    return {
      name,
      type,
      placeholder,
      value,
      help,
      id: this.getUniqId(),
    };
  }

  getFieldByEndpoint(name, fieldObj) {
    const type = ApiDocParser.getInputType(fieldObj);
    const placeholder = _.get(fieldObj, 'dataType');
    const value = _.get(fieldObj, 'default');
    const help = _.get(fieldObj, 'description');

    return this.buildField(
      name,
      type,
      placeholder,
      value,
      help,
    );
  }

  findField(fields, fieldValue, fieldField = 'id') {
    let foundField = null;

    _.forEach(fields, (group, groupKey) => {
      _.forEach(group.items, (field, fieldKey) => {
        if(field[fieldField] === fieldValue) foundField = fields[groupKey].items[fieldKey];
      });
    });

    return foundField;
  }

  handleFieldValueChange(id, value, fieldField = 'value') {
    const { fields } = this.state;
    const field = this.findField(fields, id);

    field[fieldField] = value;

    this.setFields(fields);
  }

  handleFieldNameChange(id, value) {
    this.handleFieldValueChange(id, value, 'name');
  }

  handleFieldTypeChange(id, type) {
    const { fields } = this.state;
    const field = this.findField(fields, id);

    field.type = type;
    field.value = undefined;
    field.id = this.getUniqId();

    this.setFields(fields);
  }

  getFormValues(skipNames = [], skipEmpty = true) {
    const { fields } = this.state;
    const form = {};

    _.forEach(fields, group => {
      _.forEach(group.items, field => {
        const isSkipEmpty = skipEmpty && !field.value;
        const skipByName = _.isArray(skipNames) && skipNames.indexOf(field.name) !== -1;

        if (!isSkipEmpty && !skipByName)
          form[field.name] = field.value;
      });
    });

    return form;
  }

  formReset() {
    let { fields } = this.state;

    _.forEach(fields, (group, groupKey) => {
      _.forEach(group.items, (field, fieldKey) => {
        fields[groupKey].items[fieldKey].value = undefined;
        fields[groupKey].items[fieldKey].id = this.getUniqId();
      });
    });

    setTimeout( () => this.setFields(fields) );
  }

  formSubmit(params) {
    params.nativeEvent.preventDefault();

    const { method, isLoading } = this.state;

    if (!isLoading) {

      let { url } = this.state;
      const urlParams = ApiDocParser.getUrlParams(url);
      const formWithoutUrlParams = this.getFormValues(urlParams);

      url = ApiDocParser.formatUrl(url, this.getFormValues());

      this.setState({
        ...this.state,
        isLoading: true,
      });

      ApiCall[method](url, formWithoutUrlParams)
        .then (response => (this.handleResponse(response)))
        .catch(error => this.handleResponse({ data: error.message }));
    }
  }

  handleResponse(response) {
    this.props.onResponse(response);

    this.setState({
      ...this.state,
      isLoading: false,
    });
  }

  renderFieldNameInput(field) {
    const commonProps = {
      name: field.id,
      placeholder: 'field name',
      defaultValue: field.name,
      onChange: proxy => this.handleFieldNameChange(field.id, proxy.nativeEvent.target.value),
      className: 'input-xs',
    };

    if (field.help) {
      return (
        <OverlayTrigger overlay={<Tooltip id={this.getUniqId()}>{ field.help }</Tooltip>} placement="bottom" >
          <FormControl { ...commonProps } />
        </OverlayTrigger>
      );
    }

    return <FormControl { ...commonProps } />;
  }

  renderFieldTypeInput(field) {
    return (
      <FormControl
        value={field.type}
        className="input-xs"
        componentClass="select"
        onChange={ proxy => this.handleFieldTypeChange(field.id, proxy.nativeEvent.target.value) }
      >
        { _.map(ApiDocParser.INPUT_TYPES, type => <option value={type} key={type}>{type}</option> ) }
      </FormControl>
    );
  }

  renderFieldValueInput(field) {
    const commonProps = {
      id: field.id,
      placeholder: field.placeholder,
      onChange: proxy => this.handleFieldValueChange(field.id, proxy.nativeEvent.target.value),
    };

    if(field.value) commonProps.defaultValue = field.value;

    switch (field.type) {

      case ApiDocParser.INPUT_TYPE_INT:
        commonProps.type = 'number';

      case ApiDocParser.INPUT_TYPE_STRING:
        commonProps.className = 'input-xs';
        return <FormControl { ...commonProps } />;

      case ApiDocParser.INPUT_TYPE_FILE:
        commonProps.type = 'file';
        commonProps.onChange = proxy => this.handleFieldValueChange(field.id, proxy.nativeEvent.target.files[0]);
        return <FormControl { ...commonProps } />;

      case ApiDocParser.INPUT_TYPE_BOOL:
        commonProps.className = 'input-xs';
        commonProps.componentClass = "select";
        const value = commonProps.value;
        let selected = null;
        if (value || value === 0) {
          if (value === 'false' || !value) selected = '0';
          else selected = '1';
        }
        return (
          <FormControl { ...commonProps } >
            <option></option>
            { selected === "0" ? <option selected="selected" value="0">false</option> : <option value="0">false</option> }
            { selected === "1" ? <option selected="selected" value="1">true</option> : <option value="1">true</option> }
          </FormControl>
        );
    }
  }

  renderField(field) {
    const { fields } = this.state;
    let isLastField = false;
    let theGroupKey = null;
    _.forEach(fields, (group, groupKey) => {
      if (_.find(group.items, { id: field.id })) {
        theGroupKey = groupKey;
        isLastField = _.last(group.items).id === field.id;
      }
    });

    return (
      <div key={field.id} className="b-edpt-form-row">
        <div className="b-edpt-form-col-btns">
          { this.renderRemoveFieldControl(field) }
          &nbsp;
          { isLastField && this.renderAddFieldControl(theGroupKey) }
        </div>

        <div className="b-edpt-form-field">
          <div className="b-edpt-form-col-name">
            { this.renderFieldNameInput(field) }
          </div>
          <div className="b-edpt-form-col-type">
            { this.renderFieldTypeInput(field) }
          </div>
          <div className="b-edpt-form-col-value">
            { this.renderFieldValueInput(field) }
          </div>
        </div>
      </div>
    );
  }

  renderRemoveFieldControl(field) {
    return (
      <OverlayTrigger overlay={<Tooltip id={_.uniqueId(`${field.id}-remove-field`)}>Remove field</Tooltip>} placement="bottom" >
        <Button
          bsStyle="danger"
          bsSize="xsmall"
          onClick={ () => { this.removeField(field.id) } }
        >
          <Glyphicon glyph="minus"/>
        </Button>
      </OverlayTrigger>
    );
  }

  renderAddFieldControl(theGroupKey) {

    const defaultFieldset = FieldPresetRepository.getDefaultFieldset();
    let groups = _.keys(defaultFieldset);
    groups = groups.filter(v => v !== theGroupKey);

    const plusHtml = <Glyphicon glyph="plus"/>;

    return (
      <OverlayTrigger overlay={<Tooltip id={_.uniqueId(`${theGroupKey}-add-field`)}>Add field</Tooltip>} placement="top" >
        <SplitButton
          pullRight
          title={plusHtml}
          id={`${theGroupKey}--add-btn`}
          bsSize="xsmall" bsStyle="primary"
          onClick={ () => this.addEmptyField(theGroupKey) }
        >
          { _.map(groups, type => <MenuItem key={type} onClick={ () => this.addEmptyField(type) }>{plusHtml} {type}</MenuItem> ) }
        </SplitButton>
      </OverlayTrigger>
    );
  }

  renderFieldsGroup(group) {
    return ( group.items.length > 0 &&
      <div key={ group.title }>
        <h5 className="b-group-title">{ group.title }</h5>
        { _.map(group.items, field => (this.renderField(field))) }
      </div>
    );
  }

  render() {
    const { fields, isLoading, fieldsChanged } = this.state;
    const { ApiDoc } = this.props;

    let noFields = true;
    _.forEach(fields, group => (noFields = noFields && group.items.length === 0));

    return (
      <div>
        <Grid fluid={true}>
          <Row>
            <Col xs={12} md={12} className="b-preset-controls">
              { noFields && <span>{ this.renderAddFieldControl(_.last(_.keys(fields))) }&nbsp;</span> }
              <PresetsControls
                fieldsChanged={ fieldsChanged }
                ApiDoc={ ApiDoc }
                currentFields={ fields }
                onResetFields={ () => this.resetFields() }
                onLoadPreset={ loadFields => this.setFields(loadFields) }
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={12}>
              <Form onSubmit={params => this.formSubmit(params)}>
                <FormGroup key={1}>
                  { _.map(fields, (group, type) => this.renderFieldsGroup(group) ) }
                </FormGroup>

                <FormGroup key={2}>
                  <Button bsStyle="primary" className="b-form-submit" type="submit" disabled={isLoading}><Glyphicon glyph="send" /></Button>&nbsp;
                  <OverlayTrigger overlay={<Tooltip id={_.uniqueId('reset-form')}>Reset form values</Tooltip>} placement="bottom">
                    <Button bsStyle="danger" type="reset" onClick={ () => { this.formReset() } }><Glyphicon glyph="refresh" /></Button>
                  </OverlayTrigger>&nbsp;
                  { isLoading && <Loading /> }
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

EndpointForm.propTypes = {
  ApiDoc: ApiDoc.isRequired,
  formId: PropTypes.string.isRequired,
  onResponse: PropTypes.func.isRequired,
};