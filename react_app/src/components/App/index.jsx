import React, { Component } from 'react';

import * as ApiListRepository from '../../services/ApiListRepository.js';
import * as FavoriteRepository from '../../services/FavoriteRepository.js';

import NavbarView from '../NavbarView/index.jsx';
import ApiListView from '../ApiListView/index.jsx';

import styles from './styles.css';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      apiList: [],
      filteredApiList: [],
      loading: true,
    };
  }

  componentDidMount() {
    ApiListRepository.get().then(apiList => {
      this.setState({
        ...this.state,
        apiList,
        filteredApiList: apiList,
        loading: false,
      });
    });
  }

  filterApiList(filteredApiList) {
    this.setState({
      ...this.state,
      filteredApiList,
    });
  }

  toggleFavorite(url, isFavorite) {
    if (isFavorite) FavoriteRepository.add(url);
    else FavoriteRepository.remove(url);
    this.filterApiList(this.state.filteredApiList);
  }

  render() {
    const { loading, apiList, filteredApiList } = this.state;
    return ( !loading &&
      <div>
        <NavbarView apiList={apiList} onSearch={ data => this.filterApiList(data) } />
        <ApiListView apiList={filteredApiList} toggleFavorite={(url, isFavorite) => this.toggleFavorite(url, isFavorite)} />
      </div>
    );
  }
}