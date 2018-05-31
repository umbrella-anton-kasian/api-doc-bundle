import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import styles from './styles.css';

export default class Fieldset extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      opened: this.props.opened,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      opened: nextProps.opened,
    });
  }

  render() {
    const { opened } = this.state;
    const { title, subtitle, id, color, onToggle, openable, renderLabels } = this.props;

    const colorClass = _.isNull(color) ? '' : ` color-${color}`;
    const openableClass = openable ? ` openable` : '';

    return (
      <div className={`b-fieldset panel panel-default${colorClass}`} id={id}>
        <div className={`panel-heading${openableClass}`} onClick={() => { if(openable && onToggle) onToggle(!opened) }}>
          { subtitle && <div className="panel-subtitle">{ subtitle }</div> }
          <h3 className="panel-title">{ renderLabels() }{ title }</h3>
        </div>
        { opened &&
          <div className="panel-body">
            { this.props.renderBody() }
          </div>
        }
      </div>
    );
  }
}

Fieldset.propTypes = {
  color: PropTypes.oneOf(['red', 'green', 'blue', 'silver', 'yellow', 'gray', null]),
  opened: PropTypes.bool,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  renderBody: PropTypes.func.isRequired,
  renderLabels: PropTypes.func.isRequired,
  onToggle: PropTypes.func,
  id: PropTypes.string.isRequired,
  openable: PropTypes.bool,
};

Fieldset.defaultProps = {
  opened: false,
  openable: false,
  subtitle: null,
  renderLabels: () => {},
};