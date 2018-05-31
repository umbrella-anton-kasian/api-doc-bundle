import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Button, Glyphicon, OverlayTrigger, Tooltip, FormControl, Modal, FormGroup, ControlLabel, SplitButton, MenuItem } from 'react-bootstrap';

import _ from 'lodash';

import ApiDoc from "../../../../../models/ApiDoc";
import * as FieldPresetRepository from "../../../../../services/FieldPresetRepository";
import FieldsTable from "../FieldsTable/index.jsx";

import styles from './styles.css';

export default class LoadFieldset extends React.Component {

  constructor(props) {
    super(props);

    const { ApiDoc } = this.props;

    const formId = FieldPresetRepository.getFormId(ApiDoc);

    this.state = {
      isModalOpened: false,
      currentFormId: formId,
      formId,
      forms: this.getFormsIds(formId),
      presetId: '',
    };
  }

  getFormsIds(currentFormId) {
    let forms = FieldPresetRepository.listForms();
    if (forms.indexOf(currentFormId) === -1) forms.push(currentFormId);
    return forms;
  }

  getPresets(formId) {
    return _.keys(FieldPresetRepository.getByFormId(formId));
  }

  load() {
    const { formId, presetId } = this.state;
    const fields = FieldPresetRepository.getPresetByFormId(formId, presetId);

    this.props.onLoadPreset(fields);

    this.toggleModal(false);
  };

  quickLoad(presetId) {
    const { currentFormId } = this.state;
    const fields = FieldPresetRepository.getPresetByFormId(currentFormId, presetId);

    this.props.onLoadPreset(fields);

    this.setState({
      ...this.state,
      presetId,
    });
  }

  deleteForm() {
    const { currentFormId, formId } = this.state;

    FieldPresetRepository.deleteForm(formId);

    this.setState({
      ...this.state,
      formId: currentFormId,
      forms: this.getFormsIds(currentFormId),
      presetId: '',
    });
  }

  deletePreset() {
    const { presetId, formId } = this.state;

    FieldPresetRepository.deletePreset(formId, presetId);

    this.setState({
      ...this.state,
      presetId: '',
    });
  }

  changeForm(formId) {
    this.setState({
      ...this.state,
      formId,
      presetId: '',
    });
  }

  changePreset(presetId) {
    this.setState({
      ...this.state,
      presetId,
    });
  }

  renderModalOpenBtn() {
    const { currentFormId } = this.state;
    const icon = <Glyphicon glyph="export" />;
    const presets = this.getPresets(currentFormId);

    return (
      <OverlayTrigger overlay={<Tooltip id={_.uniqueId('preset-fields')}>Load fields set</Tooltip>} placement="top" >
        <span>
          { presets.length > 0 &&
            <SplitButton
              pullRight
              title={icon}
              id={_.uniqueId('preset-fields-load-quick')}
              bsSize="xsmall"
              bsStyle="primary"
              onClick={ () => this.toggleModal(true) }
            >
              { _.map(presets, (v, k) => <MenuItem key={k} onClick={ () => this.quickLoad(v) }>{v}</MenuItem> ) }
            </SplitButton>
          }
          { !presets.length &&
            <Button bsSize="xsmall" title="Load fields set" bsStyle="primary" onClick={ () => this.toggleModal(true) }>{icon}</Button>
          }
        </span>
      </OverlayTrigger>
    );
  }

  toggleModal(isModalOpened) {
    this.setState({
      ...this.state,
      isModalOpened,
    });
  };

  renderModal() {
    const { isModalOpened, presetId } = this.state;
    const emptyPreset = _.isEmpty(presetId);

    return (
      <Modal
        show={isModalOpened}
        onHide={ () => this.toggleModal(false) }
        aria-labelledby="LoadFields"
      >
        <Modal.Header closeButton>
          <Modal.Title>Load fields</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { this.renderForm() }
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="danger" bsSize="sm" onClick={ () => this.toggleModal(false) }>Cancel</Button>
          <Button
            disabled={ emptyPreset }
            bsStyle="primary"
            bsSize="sm"
            onClick={ () => this.load() }
          >
            Load
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  renderForm() {
    const { formId, presetId, forms, currentFormId } = this.state;

    const presets = this.getPresets(formId);

    const fields = FieldPresetRepository.getPresetByFormId(formId, presetId);

    const emptyPreset = _.isEmpty(presetId);
    const emptyPresetList = _.isEmpty(presets) && !FieldPresetRepository.hasFormId(formId);

    return (
      <Grid fluid={true}>

        <Row className="LoadFieldset-fields-modal-row">
          <Col xs={12} md={2}>
            <FormGroup>
              <ControlLabel className="LoadFieldset-preset-title">Form</ControlLabel>
            </FormGroup>
          </Col>
          <Col xs={12} md={9}>

            <FormControl
              value={ formId }
              bsSize="sm"
              componentClass="select"
              onChange={ proxy => this.changeForm(proxy.nativeEvent.target.value) }
            >
              { _.map(forms, (v, k) => <option key={k} value={v}>{ v === currentFormId ? '* ' : ''}{ v }</option> ) }
            </FormControl>

          </Col>

          <Col xs={12} md={1}>

            { emptyPresetList &&
              <Button bsStyle="danger" bsSize="sm" disabled ><Glyphicon glyph="trash" /></Button>
            }
            { !emptyPresetList &&
              <OverlayTrigger overlay={<Tooltip id={_.uniqueId('delete-form-presets')}>Delete all form field sets</Tooltip>} placement="bottom" >
                <Button bsStyle="danger" bsSize="sm"><Glyphicon glyph="trash" onClick={ () => this.deleteForm() } /></Button>
              </OverlayTrigger>
            }

          </Col>
        </Row>

        <Row className="LoadFieldset-fields-modal-row">
          <Col xs={12} md={2}>
            <FormGroup>
              <ControlLabel className="LoadFieldset-preset-title">Preset</ControlLabel>
            </FormGroup>
          </Col>
          <Col xs={12} md={9}>

            <FormControl
              value={ presetId }
              bsSize="sm"
              componentClass="select"
              onChange={ proxy => this.changePreset(proxy.nativeEvent.target.value) }
            >
              <option value="">-</option>
              { _.map(presets, (v, k) => <option key={k} value={v}>{ v }</option> ) }
            </FormControl>
          </Col>

          <Col xs={12} md={1}>
            { emptyPreset &&
              <Button bsStyle="danger" bsSize="sm" disabled ><Glyphicon glyph="trash" /></Button>
            }
            { !emptyPreset &&
              <OverlayTrigger overlay={<Tooltip id={_.uniqueId('delete-preset1')}>Delete field set</Tooltip>} placement="bottom" >
                <Button bsStyle="danger" bsSize="sm"><Glyphicon glyph="trash" onClick={ () => this.deletePreset() } /></Button>
              </OverlayTrigger>
            }
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={12}>
            <FieldsTable fields={ fields } />
          </Col>
        </Row>
      </Grid>
    );
  }

  render() {
    return (
      <span>
        { this.renderModalOpenBtn() }
        { this.renderModal() }
      </span>
    );
  }
}

LoadFieldset.propTypes = {
  currentFields: PropTypes.object.isRequired,
  onLoadPreset: PropTypes.func.isRequired,
  ApiDoc: ApiDoc.isRequired,
};