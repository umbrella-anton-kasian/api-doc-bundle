import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Grid, Row, Col, Form, FormControl, Button, Glyphicon } from 'react-bootstrap';

import ApiDoc from '../../models/ApiDoc.js';
import * as ApiDocParser from '../../services/ApiDocParser';
import * as FavoriteRepository from '../../services/FavoriteRepository.js';
import FavoriteButton from '../FavoriteButton/index.jsx';

import styles from './styles.css';

export default class ApiListSearch extends React.Component {

  constructor(props) {
    super(props);

    const { apiList } = this.props;
    const bundlesList = this.getBundlesList(apiList);

    this.state = {
      apiList,
      bundlesList,
      form: {
        search: '',
        bundle: '',
        onlyFavorite: false,
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.state,
      apiList: nextProps.apiList,
    });
  }

  getBundlesList(apiList) {
    let bundlesList = [];

    _.map(apiList, ApiDoc => {
      const section = ApiDocParser.buildSection(ApiDoc);
      const bundle = section.name.match(/([^\s]+Bundle)/);
      if(_.isArray(bundle)) bundlesList.push(_.first(bundle));
    });

    bundlesList = _.uniq(bundlesList);
    bundlesList.sort();

    return bundlesList;
  }

  handleValueChange(name, value) {
    const { form } = this.state;
    form[name] = value;

    this.setState({
      ...this.state,
      form,
    });
  }

  resetForm() {
    const { form } = this.state;
    _.map(form, (v, k) => {
      switch(typeof v) {
        case 'string': form[k] = ''; break;
        case 'boolean': form[k] = false; break;
      }
    });

    this.setState({
      ...this.state,
      form,
    });

    this.submitForm();
  }

  submitForm() {
    const { apiList } = this.state;
    const filteredApiList = [];

    _.forEach(apiList, ApiDoc => {
      let add = true;

      add = add && this.filterSection(ApiDoc);
      add = add && this.filterEndpoint(ApiDoc);

      if(add) filteredApiList.push(ApiDoc);
    });

    this.props.onSearch(filteredApiList);
  }

  filterSection(ApiDoc) {
    const { bundle } = this.state.form;
    const section = ApiDocParser.buildSection(ApiDoc);

    return section.name.indexOf(bundle) !== -1;
  }

  filterEndpoint(ApiDoc) {
    const { form } = this.state;
    const { search, onlyFavorite } = form;

    const ApiDocItem = ApiDocParser.buildApiDocItem(ApiDoc);
    const searchConfirmed = ApiDocItem.resource.indexOf(search) !== -1;
    const favoriteConfirmed = !onlyFavorite || FavoriteRepository.isFavorite(ApiDocItem.resource);

    return searchConfirmed && favoriteConfirmed;
  }

  renderFavoriteBtn() {
    const { onlyFavorite } = this.state.form;
    const onClick = () => {
      this.handleValueChange('onlyFavorite', !onlyFavorite);
      this.submitForm();
    };

    return (
      <FavoriteButton isActive={ onlyFavorite } onClick={ () => onClick() } btnSize="big"/>
    );
  }

  renderBundleSelect() {
    const { bundlesList } = this.state;
    const onChange = proxy => {
      this.handleValueChange('bundle', proxy.nativeEvent.target.value);
      this.submitForm();
    };

    return (
      <FormControl
        bsSize="sm"
        componentClass="select"
        onChange={ onChange }
      >
        <option key="bundle-filter-all" value=''>All bundles</option>
        { _.map(bundlesList, bundle => <option key={`bundle-filter-${bundle}`} value={ bundle }>{ bundle }</option>)}
      </FormControl>
    );
  }

  renderSearchByEndpoint() {
    return (
      <div>
        <div className="b-search-buttons">
          <Button bsStyle="primary" bsSize="sm" type="submit"><Glyphicon glyph="ok" /></Button>&nbsp;
          <Button bsStyle="danger" bsSize="sm" type="reset" onClick={ () => this.resetForm() }><Glyphicon glyph="remove" /></Button>
        </div>
        <div className="b-search-input">
          <FormControl
            type="text"
            placeholder="Search by url"
            bsSize="sm"
            onChange={ proxy => this.handleValueChange('search', _.trim(proxy.nativeEvent.target.value))}
          />
        </div>
      </div>
    );
  }

  render() {
    return (
      <Form onSubmit={ params => { params.nativeEvent.preventDefault(); this.submitForm(); } }>
        <Grid fluid={true}>
          <Row>
            <Col xs={12} md={1}>
              { this.renderFavoriteBtn() }
            </Col>
            <Col xs={12} md={3}>
              { this.renderBundleSelect() }
            </Col>
            <Col xs={12} md={8}>
              { this.renderSearchByEndpoint() }
            </Col>
          </Row>
        </Grid>
      </Form>
    );
  }
}

ApiListSearch.propTypes = {
  apiList: PropTypes.arrayOf(ApiDoc),
  onSearch: PropTypes.func.isRequired,
};