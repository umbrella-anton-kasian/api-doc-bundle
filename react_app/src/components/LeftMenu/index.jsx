import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

import ApiDoc from '../../models/ApiDoc.js';
import * as FavoriteRepository from '../../services/FavoriteRepository.js';
import Tree from './Tree/index.jsx';
import FavoriteButton from '../FavoriteButton/index.jsx';
import * as ApiDocParser from '../../services/ApiDocParser';

import styles from './styles.css';

export default class LeftMenu extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      hoverTimeout: undefined,
    };
  }

  componentDidMount() {
    window.addEventListener('wheel', () => this.handleScroll());
  }

  componentWillUnmount() {
    window.removeEventListener('wheel', () => this.handleScroll());
  }

  handleScroll() {
    const menuElem = document.querySelector('.b-left-menu');
    menuElem.className = 'b-left-menu no-title-hover';
    clearTimeout(this.state.hoverTimeout);
    this.setState({
      ...this.state,
      hoverTimeout: setTimeout(() => (menuElem.className = 'b-left-menu'), 300),
    });
  }

  onHover(event) {
    const link = event.target;
    const hoverElem = _.first(link.parentNode.children);
    hoverElem.style.top = `${link.getBoundingClientRect().top}px`;
  }

  renderEndpoint(ApiDocItem) {
    const isFavorite = FavoriteRepository.isFavorite(ApiDocItem.resource);
    return (
      <div key={ApiDocItem.id} className="b-menu-item">
        <div className="b-menu-item-favorite">
          <FavoriteButton
            isActive={ isFavorite }
            onClick={ () => this.props.toggleFavorite(ApiDocItem.resource, !isFavorite) }
          />
        </div>
        <div className="b-menu-item-link">
          <a
            className="b-menu-item-link-hover"
            title={ApiDocItem.title}
            href={`#${ApiDocItem.id}`}
            onClick={ () => this.props.updateOpenFlag(ApiDocItem.id, true) }
          >
            { ApiDocItem.name }
          </a>
          <a
             className="menuHoverLink"
             title={ApiDocItem.title}
             href={`#${ApiDocItem.id}`}
             onClick={ () => this.props.updateOpenFlag(ApiDocItem.id, true) }
             onMouseEnter={ event => this.onHover(event) }
          >
            { ApiDocItem.name }
          </a>
        </div>
      </div>
    );
  }

  renderSection(section) {
    return (
      <Tree
        level={2}
        key={section.id}
        title={section.name}
        renderBody={ () => _.map(section.items, ApiDocItem => this.renderEndpoint(ApiDocItem)) }
        opened={ this.props.isOpened(section.id) }
        menuClick={ () => this.props.updateOpenFlag(section.id, true) }
        link={`#${section.id}`}
      />
    );
  }

  renderType(type) {
    return (
      <Tree
        level={1}
        key={type.id}
        title={type.name}
        renderBody={ () => _.map(type.items, section => this.renderSection(section)) }
        opened={ this.props.isOpened(type.id) }
        menuClick={ () => this.props.updateOpenFlag(type.id, true) }
        link={`#${type.id}`}
      />
    );
  }

  renderNotFound() {
    return ( _.isEmpty(this.props.apiList) &&
      <ListGroup>
        <ListGroupItem bsStyle="warning">No endpoints found, update filter</ListGroupItem>
      </ListGroup>
    );
  }

  render() {
    const menuList = ApiDocParser.buildMenuHierarchy(this.props.apiList);

    return (
      <div className="b-left-menu">
        <div className="b-left-menu-scroll">
          <div className="b-left-menu-inner">
            { this.renderNotFound() }
            { _.map(menuList, type => (this.renderType(type))) }
          </div>
        </div>
      </div>
    );
  }
}

LeftMenu.propTypes = {
  apiList: PropTypes.arrayOf(ApiDoc),
  updateOpenFlag: PropTypes.func,
  toggleFavorite: PropTypes.func,
  isOpened: PropTypes.func,
};