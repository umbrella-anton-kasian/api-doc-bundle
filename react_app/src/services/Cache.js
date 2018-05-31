import lscache from 'lscache';

export default class Cache {

  static getName(name) {
    const prefix = 'jc-api-';
    return `${prefix}${name}`;
  }

  static set(name, value) {
    if(lscache.supported()) {
      lscache.set(Cache.getName(name), value);
    }
  }

  static get(name) {
    if (!lscache.supported()) return null;
    return lscache.get(Cache.getName(name));
  }

  static remove(name) {
    if(lscache.supported()) {
      lscache.remove(Cache.getName(name));
    }
  }
}