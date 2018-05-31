import React, { Component } from 'react';
import { Glyphicon, OverlayTrigger, Tooltip, Modal, Button, FormControl, ControlLabel } from 'react-bootstrap';

import * as SettingsRepository from '../../services/SettingsRepository';
import JsonView from '../JsonView/index.jsx';

import styles from './styles.css';

export default class Settings extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      settings: SettingsRepository.load(),
      isOpened: false,
    };
  }

  saveSettings() {
    SettingsRepository.save(this.state.settings);
    window.location.reload();
  }

  handleValueChange(name, value) {
    const settings = this.state.settings;
    settings[name] = value;
    this.setState({
      ...this.state,
      settings,
    });
  }

  renderEndpointsViewSetting() {
    const name = SettingsRepository.getEndpointsViewName();
    const value = this.state.settings[name];
    const values = SettingsRepository.getEndpointsViewValues();
    return (
      <div key={name} className="b-settings-item">
        <ControlLabel>Endpoints view</ControlLabel>
        <FormControl
          bsSize="sm"
          defaultValue={value}
          name={name}
          componentClass="select"
          onChange={ proxy => this.handleValueChange(proxy.nativeEvent.target.name, proxy.nativeEvent.target.value) }
        >
          { _.map(values, val => <option value={val} key={val}>{ val }</option>) }
        </FormControl>
      </div>
    );
  }

  renderJsonViewSettings() {
    const testData = {
      testObject: {
        testNumber: 123,
        testArray: [ 'a', 1, 'b', 2, ],
      },
    };
    const name = SettingsRepository.getJsonViewThemeName();
    const themes = SettingsRepository.getJsonViewThemeValues();
    const theme = this.state.settings[name];
    const values = _.keys(themes);
    const value = theme.scheme;

    const nameLength = SettingsRepository.getJsonViewLengthName();
    const valuesLength = SettingsRepository.getJsonViewLengthValues();
    const valueLength = this.state.settings[nameLength];

    return (
      <div key={name} className="b-settings-item">
        <ControlLabel>Json view color theme</ControlLabel>
        <FormControl
          bsSize="sm"
          value={value}
          name={name}
          componentClass="select"
          onChange={ proxy => this.handleValueChange(proxy.nativeEvent.target.name, themes[proxy.nativeEvent.target.value]) }
        >
          { _.map(values, val => <option value={val} key={val}>{ val }</option>) }
        </FormControl>

        <ControlLabel>Json view show keys length</ControlLabel>
        <FormControl
          bsSize="sm"
          value={valueLength ? 1 : 0}
          name={nameLength}
          componentClass="select"
          onChange={ proxy => this.handleValueChange(proxy.nativeEvent.target.name, !!+proxy.nativeEvent.target.value) }
        >
          { _.map(valuesLength, val => <option value={val ? 1 : 0} key={val}>{ val ? 'true' : 'false' }</option>) }
        </FormControl>

        <JsonView data={testData} opened theme={theme} showKeys={valueLength} />
      </div>
    );
  }

  renderSettings() {
    return (
      <div>
        { this.renderEndpointsViewSetting() }
        { this.renderJsonViewSettings() }
      </div>
    );
  }

  openModal() {
    this.setState({ ...this.state, isOpened: true });
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
        aria-labelledby="SettingsModalHeader"
      >
        <Modal.Header closeButton>
          <Modal.Title id='SettingsModalHeader'>Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { this.renderSettings() }
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="danger" bsSize="sm" onClick={() => this.closeModal()}>Cancel</Button>
          <Button bsStyle="primary" bsSize="sm" onClick={() => this.saveSettings()}>Save</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  renderButton() {
    return (
      <div className="b-settings-btn">
        <OverlayTrigger
          overlay={<Tooltip id="SettingsButton">Settings</Tooltip>}
          placement="bottom"
          delayShow={300}
          delayHide={150}
        >
          <Glyphicon glyph="cog" onClick={ () => this.openModal() } />
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