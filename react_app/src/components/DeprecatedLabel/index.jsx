import React, { Component } from 'react';
import { Label } from 'react-bootstrap';

import styles from './styles.css';

export default class DeprecatedLabel extends React.Component {

  render() {
    return (
      <Label className="b-label-deprecated">Deprecated</Label>
    );
  }
}