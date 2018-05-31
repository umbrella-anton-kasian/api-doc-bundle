import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-bootstrap';

import ApiDoc from '../../models/ApiDoc.js';
import * as ApiDocParser from '../../services/ApiDocParser';
import EndpointsView from '../EndpointsView/index.jsx';
import LeftMenu from '../LeftMenu/index.jsx';

import styles from './styles.css';

export default class ApiListView extends React.Component {

  generateState(props) {
    const { apiList } = props;
    const current = this.getHash();

    let openFlags = this.generateOpenFlags(apiList);
    openFlags = this._updateOpenFlag(apiList, openFlags, current, true);

    return {
      apiList,
      openFlags,
      current,
    };
  }

  constructor(props) {
    super(props);

    this.state = this.generateState(this.props);
    this.setHash(this.state.current);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      this.generateState(nextProps)
    );
    this.setHash(this.state.current);
  }

  getHash() {
    return location.hash.substr(1)
  }

  setHash(index) {
    location.hash = `${index}1`;
    location.hash = index;
  }

  generateOpenFlags(apiList) {
    const flags = {
      types: {},
      sections: {},
      items: {},
    };

    _.forEach(apiList, ApiDoc => {
      flags.types[ApiDocParser.buildType(ApiDoc).id] = false;
      flags.sections[ApiDocParser.buildSection(ApiDoc).id] = false;
      flags.items[ApiDocParser.buildApiDocItem(ApiDoc).id] = false;
    });

    return flags;
  }

  _updateOpenFlag(apiList, flags, index, opened) {

    _.forEach(apiList, ApiDoc => {
      const type = ApiDocParser.buildType(ApiDoc).id;
      const section = ApiDocParser.buildSection(ApiDoc).id;
      const item = ApiDocParser.buildApiDocItem(ApiDoc).id;

      const isType = type === index;
      const isSection = section === index;
      const isItem = item === index;

      if(opened) {
        if(isItem) {
          flags.items[item] = true;
          flags.sections[section] = true;
          flags.types[type] = true;

        } else if(isSection) {
          flags.sections[section] = true;
          flags.types[type] = true;

        } else if(isType) flags.types[type] = true;

      } else {
        if(isItem) flags.items[item] = false;
        else if(isSection) flags.sections[section] = false;
        else if(isType) flags.types[type] = false;
      }
    });

    return flags;
  }

  updateOpenFlag(index, opened) {
    let { apiList, openFlags } = this.state;
    openFlags = this._updateOpenFlag(apiList, openFlags, index, opened);

    this.setState({
      ...this.state,
      openFlags,
      current: index,
    });
  }

  isOpened(index) {
    let opened = false;
    const { openFlags } = this.state;

    _.forEach(openFlags, flagTypeAr => opened = opened || flagTypeAr[index] );

    return opened;
  }

  render() {
    const { apiList, current } = this.state;

    return (
      <Grid fluid={true} className="b-main-content">
        <Row>
          <Col xs={12} md={3}>
            <LeftMenu
              apiList={apiList}
              updateOpenFlag={(index, opened) => { this.updateOpenFlag(index, opened) }}
              isOpened={index => this.isOpened(index) }
              toggleFavorite={(url, isFavorite) => this.props.toggleFavorite(url, isFavorite)}
            />
          </Col>
          <Col xs={12} md={9}>
            <EndpointsView
              apiList={apiList}
              updateOpenFlag={(index, opened) => { this.updateOpenFlag(index, opened) }}
              isOpened={index => this.isOpened(index) }
              current={current}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

ApiListView.propTypes = {
  apiList: PropTypes.arrayOf(ApiDoc),
  toggleFavorite: PropTypes.func,
};