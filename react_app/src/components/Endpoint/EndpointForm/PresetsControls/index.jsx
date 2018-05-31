import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap';

import _ from 'lodash';

import ApiDoc from "../../../../models/ApiDoc";
import SaveFieldset from "./SaveFieldset/index.jsx";
import LoadFieldset from "./LoadFieldset/index.jsx";

export default class PresetsControls extends React.Component {

  renderResetControl() {
    const { onResetFields, fieldsChanged } = this.props;

    if(!fieldsChanged) return <Button bsStyle="danger" bsSize="xsmall" disabled><Glyphicon glyph="home" /></Button>;

    return (
      <OverlayTrigger overlay={<Tooltip id={_.uniqueId('reset-controls')}>Reset fields to default</Tooltip>} placement="bottom">
        <Button bsSize="xsmall" bsStyle="danger"><Glyphicon glyph="home" onClick={() => onResetFields()}/></Button>
      </OverlayTrigger>
    );
  }

  render() {
    const { ApiDoc, currentFields, onLoadPreset } = this.props;

    return (
      <span>
        <SaveFieldset
          onLoadPreset={ preset => onLoadPreset(preset) }
          currentFields={ currentFields }
          ApiDoc={ ApiDoc }
        />
        &nbsp;
        <LoadFieldset
          onLoadPreset={ preset => onLoadPreset(preset) }
          currentFields={ currentFields }
          ApiDoc={ ApiDoc }
        />
        &nbsp;
        { this.renderResetControl() }
      </span>
    );
  }
}

PresetsControls.propTypes = {
  onLoadPreset: PropTypes.func.isRequired,
  onResetFields: PropTypes.func.isRequired,
  fieldsChanged: PropTypes.bool,
  currentFields: PropTypes.object.isRequired,
  ApiDoc: ApiDoc.isRequired,
};