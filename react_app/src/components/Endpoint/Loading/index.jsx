import React, { Component } from 'react';
import _ from 'lodash';
import { Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap';

import styles from './styles.css';

export default class Loading extends React.Component {

  render() {
    const id = _.uniqueId('loading-');

    let tooltip = <Tooltip id={id}>Loading</Tooltip>;

    return (
      <span className="b-loading">
        <span className="b-loading-inner">
          <span className="b-loading-spin">
            <OverlayTrigger
              overlay={tooltip}
              placement="bottom"
              delayShow={300}
              delayHide={150}
            >
              <Glyphicon glyph="hourglass" />
            </OverlayTrigger>
          </span>
        </span>
      </span>
    );
  }
}