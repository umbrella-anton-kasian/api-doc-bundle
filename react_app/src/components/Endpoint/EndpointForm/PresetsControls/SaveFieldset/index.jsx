import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Button, Glyphicon, OverlayTrigger, Tooltip, FormControl, Modal, Form, FormGroup, ControlLabel } from 'react-bootstrap';

import _ from 'lodash';

import ApiDoc from "../../../../../models/ApiDoc";
import * as FieldPresetRepository from "../../../../../services/FieldPresetRepository";
import FieldsTable from "../FieldsTable/index.jsx";

import styles from './styles.css';

export default class SaveFieldset extends React.Component {

  constructor(props) {
    super(props);

    let { presetName } = this.props;

    if (_.isEmpty(presetName)) presetName = '';

    this.state = {
      isModalOpened: false,
      presetName,
    };
  }

  save() {
    const { currentFields, ApiDoc, onLoadPreset } = this.props;
    const { presetName } = this.state;

    onLoadPreset(currentFields);

    if (!this.isEmptyPresetName()) {
      FieldPresetRepository.addByApiDoc(ApiDoc, presetName, currentFields);
      this.toggleModal(false);
    }
  };

  isEmptyPresetName () {
    const { presetName } = this.state;
    return _.isEmpty(presetName);
  }

  isNewPreset() {
    const { ApiDoc } = this.props;
    const { presetName } = this.state;
    const formPresetNames = _.keys(FieldPresetRepository.getByApiDoc(ApiDoc));

    return formPresetNames.indexOf(presetName) === -1;
  }

  changePresetName(presetName) {
    this.setState({
      ...this.state,
      presetName,
    });
  }

  renderModalOpenBtn() {
    return (
      <OverlayTrigger overlay={<Tooltip id={_.uniqueId('preset-fields')}>Save fields set</Tooltip>} placement="bottom" >
        <Button bsSize="xsmall" bsStyle="primary"><Glyphicon glyph="import" onClick={ () => this.toggleModal(true) } /></Button>
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
    const { isModalOpened } = this.state;

    return (
      <Modal
        show={isModalOpened}
        onHide={ () => this.toggleModal(false) }
        aria-labelledby="SaveFields"
      >
        <Modal.Header closeButton>
          <Modal.Title>Save fields</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={ params => { params.nativeEvent.preventDefault(); this.save(); } }>
            { this.renderSaveForm() }
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="danger" bsSize="sm" onClick={ () => this.toggleModal(false) }>Cancel</Button>
          <Button
            bsStyle="primary"
            disabled={ this.isEmptyPresetName() }
            bsSize="sm"
            onClick={ () => this.save() }
          >
            { this.isNewPreset() ? 'Create' : 'Overwrite' }
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  renderSaveForm() {
    const { presetName } = this.state;
    const { currentFields, ApiDoc } = this.props;

    const formPresetNames = _.keys(FieldPresetRepository.getByApiDoc(ApiDoc));
    const isNewPreset = this.isNewPreset();
    const validationState = this.isEmptyPresetName() ? 'error' : (isNewPreset ? 'success' : 'warning');

    return (
      <Grid fluid={true}>
        <Row className="SaveFieldset-fields-modal-row">
          <Col xs={12} md={3}>
            <FormGroup validationState={validationState}>
              <ControlLabel className="SaveFieldset-preset-title">Preset name</ControlLabel>
            </FormGroup>
          </Col>
          <Col xs={12} md={6}>

            <FormGroup validationState={validationState}>
              <FormControl
                type="text"
                placeholder="Enter preset name"
                value={presetName}
                bsSize="sm"
                onChange={ proxy => this.changePresetName(_.trim(proxy.nativeEvent.target.value)) }
              />
            </FormGroup>

          </Col>
          <Col xs={12} md={3}>

            <FormControl
              value={ isNewPreset ? '' : presetName }
              bsSize="sm"
              componentClass="select"
              onChange={ proxy => this.changePresetName(proxy.nativeEvent.target.value) }
            >
              <option value="">New</option>
              { _.map(formPresetNames, (v, k) => <option key={k}>{ v }</option> ) }
            </FormControl>

          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12}>
            <FieldsTable fields={ currentFields } />
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

SaveFieldset.propTypes = {
  currentFields: PropTypes.object.isRequired,
  onLoadPreset: PropTypes.func.isRequired,
  ApiDoc: ApiDoc.isRequired,
};