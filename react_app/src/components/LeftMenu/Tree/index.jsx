import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';
import _ from 'lodash';
import PropTypes from 'prop-types';

import styles from './styles.css';

export default class Tree extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      opened: this.props.opened,
    };
  }

  toggle(opened = null) {
    this.setState({
      ...this.state,
      opened: _.isNull(opened) ? !this.state.opened : opened,
    });
  }

  onHover(event) {
    const link = event.target;
    _.first(link.parentNode.children).style.top = `${link.getBoundingClientRect().top}px`;
  }

  render() {
    const { opened } = this.state;
    const { title, link, level } = this.props;

    return (
      <div className={`b-tree lvl-${level}`}>
        <div className="b-tree-link">
          <div className="b-tree-sign" onClick={ () => this.toggle() }>
            <Glyphicon glyph={`triangle-${ opened ? 'bottom' : 'right' }`} />
          </div>
          <div className="b-tree-link-title">
            <a
              href={link}
              onClick={ () => { this.toggle(); this.props.menuClick(); } }
              className="b-tree-link-hover"
            >
              { title }
            </a>
            <a
              href={link}
              onClick={ () => { this.toggle(); this.props.menuClick(); } }
              className="treeHoverLink"
              onMouseEnter={ event => this.onHover(event) }
            >
              { title }
            </a>
          </div>
        </div>
        { opened &&
          <div className="b-tree-body">
            { this.props.renderBody() }
          </div>
        }
      </div>
    );
  }
}

Tree.propTypes = {
  opened: PropTypes.bool,
  title: PropTypes.string.isRequired,
  renderBody: PropTypes.func.isRequired,
  menuClick: PropTypes.func.isRequired,
  link: PropTypes.string.isRequired,
  level: PropTypes.number,
};

Tree.defaultProps = {
  opened: false,
  level: -1,
};