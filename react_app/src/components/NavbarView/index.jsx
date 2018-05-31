import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ApiDoc from '../../models/ApiDoc.js';
import Settings from '../Settings/index.jsx';
import ApiListSearch from '../ApiListSearch/index.jsx';
import CustomHeaders from '../CustomHeaders/index.jsx';
import Presets from '../Presets/index.jsx';

import styles from './styles.css';

export default class NavbarView extends React.Component {

  onNavbarChange() {
    setTimeout(() => {
      const navbar = document.querySelector('.b-navbar');
      const navbarInner = document.querySelector('.b-navbar-inner');
      const height = navbarInner.clientHeight + 30;
      navbar.style.maxHeight = `${height}px`;
    });
  }

  mouseEnter() {
    this.onNavbarChange();
  }

  mouseLeave() {
    document.querySelector('.b-navbar').style.maxHeight = '';
  }

  render() {
    const { apiList, onSearch } = this.props;
    return (
      <div className="b-navbar">
        <div className="b-navbar-inner">
          <div className="b-navbar-settings">
            <Settings />
          </div>
          <div className="b-navbar-presets">
            <Presets />
          </div>
          <div className="b-navbar-line">
            <div className="b-navbar-search">
              <ApiListSearch apiList={apiList} onSearch={ data => onSearch(data) } />
            </div>
            <div className="b-navbar-headers" onMouseEnter={() => this.mouseEnter() } onMouseLeave={ () => this.mouseLeave() }>
              <CustomHeaders onChange={ () => this.onNavbarChange() } />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ApiListSearch.propTypes = {
  apiList: PropTypes.arrayOf(ApiDoc),
  onSearch: PropTypes.func.isRequired,
};