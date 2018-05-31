import _ from 'lodash';

import Cache from './Cache.js';

const favoriteListCacheKey = 'favorite-endpoints';

function save(favorites = []) {
  Cache.set(favoriteListCacheKey, favorites.join(','));
  return favorites;
}

export function list() {
  const favorites = Cache.get(favoriteListCacheKey);
  if (favorites) return favorites.split(',');
  return [];
}

export function add(url) {
  const favorites = list();
  favorites.push(url);
  save(favorites);
}

export function remove(url) {
  const favorites = _.without(list(), url);
  save(favorites);
  return favorites;
}

export function isFavorite(url) {
  return list().indexOf(url) > -1;
}