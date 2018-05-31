import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Glyphicon, Tooltip, OverlayTrigger } from 'react-bootstrap';

import styles from './styles.css';

export default class FavoriteButton extends React.Component {

  render() {
    const { isActive, onClick, btnSize } = this.props;
    const helpText = 'Favorite';
    const id = _.uniqueId("FavoriteButton-");
    const tooltip = <Tooltip id={id}>{ helpText }</Tooltip>;

    return (
      <div className={`b-favorite-btn${ isActive ? ' active' : ''} ${btnSize}`}>
        <OverlayTrigger
          overlay={tooltip}
          placement="bottom"
          delayShow={300}
          delayHide={150}
        >
          <Glyphicon glyph={ isActive ? 'star' : 'star-empty'} onClick={ onClick } />
        </OverlayTrigger>
      </div>
    );
  }
}

FavoriteButton.propTypes = {
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  btnSize: PropTypes.oneOf(['big', '']),
};

FavoriteButton.defaultProps = {
  btnSize: '',
};