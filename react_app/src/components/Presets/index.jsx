import React, { Component } from 'react';
import { Glyphicon, OverlayTrigger, Tooltip, Modal, Button, FormControl, ControlLabel } from 'react-bootstrap';

import * as FieldPresetRepository from '../../services/FieldPresetRepository';

import styles from './styles.css';

export default class Settings extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      presets: FieldPresetRepository.load(),
      isOpened: false,
    };
  }

  parseJson(presets) {
    let out;
    try { out = JSON.parse(presets); } catch (e) { out = {} }
    return out;
  }

  savePresets() {
    FieldPresetRepository.save(this.parseJson(this.state.presets));
    window.location.reload();
  }

  mergePresets() {
    const repoPresets = FieldPresetRepository.list();
    let { presets } = this.state;

    FieldPresetRepository.save(_.merge({}, repoPresets, this.parseJson(presets)));
    window.location.reload();
  }

  handleValueChange(presets) {
    this.setState({
      ...this.state,
      presets,
    });
  }

  renderForm() {
    const { presets } = this.state;
    return (
      <div key="presets" className="b-settings-item">
        <ControlLabel>Presets json</ControlLabel>
        <FormControl
          className="b-presets-textarea"
          value={presets}
          name="presets"
          componentClass="textarea"
          onChange={ proxy => this.handleValueChange(proxy.nativeEvent.target.value) }
        />
      </div>
    );
  }

  openModal() {
    this.setState({
      ...this.state,
      isOpened: true,
      presets: FieldPresetRepository.load(),
    });
  }

  closeModal() {
    this.setState({ ...this.state, isOpened: false });
  }

  renderModal() {
    const { isOpened } = this.state;
    return (
      <Modal
        show={ isOpened }
        onHide={ () => this.closeModal() }
        aria-labelledby="PresetsModalHeader"
      >
        <Modal.Header closeButton>
          <Modal.Title id='PresetsModalHeader'>Presets import/export</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { this.renderForm() }
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="danger" bsSize="sm" onClick={() => this.closeModal()}>Cancel</Button>
          <Button bsStyle="primary" bsSize="sm" onClick={() => this.mergePresets()}>Merge</Button>
          <Button bsStyle="primary" bsSize="sm" onClick={() => this.savePresets()}>Overwrite</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  renderButton() {
    return (
      <div className="b-presets-btn">
        <OverlayTrigger
          overlay={<Tooltip id="PresetsButton">Presets import/export</Tooltip>}
          placement="bottom"
          delayShow={300}
          delayHide={150}
        >
          <Glyphicon glyph="book" onClick={ () => this.openModal() } />
        </OverlayTrigger>
      </div>
    );
  }

  render() {

    return (
      <div>
        { this.renderModal() }
        { this.renderButton() }
      </div>
    );
  }
}