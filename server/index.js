import './dotenv';
import { normalize } from 'path';
import element from '../shared/element';
import fragment from '../shared/fragment';
import getProxyableMethods from '../shared/getProxyableMethods';
import { usePlugins } from '../shared/plugins';
import context from './context';
import environment from './environment';
import generator from './generator';
import instanceProxyHandler from './instanceProxyHandler';
import invoke from './invoke';
import project from './project';
import registry from './registry';
import secrets from './secrets';
import server from './server';
import settings from './settings';
import worker from './worker';

globalThis.window = {}

context.server = server;
context.project = project;
context.environment = environment;
context.settings = settings;
context.secrets = secrets;
context.worker = worker;

server.less = normalize(__filename) !== normalize(process.argv[1])

class Nullstack {

  static registry = registry;
  static element = element;
  static invoke = invoke;
  static fragment = fragment;
  static use = usePlugins('server');

  static start(Starter) {
    if (this.name.indexOf('Nullstack') > -1) {
      generator.starter = () => element(Starter);
      setTimeout(server.start, 0)
      return context;
    }
  }

  _self = {
    prerendered: true,
    initiated: false,
    hydrated: false,
    terminated: false,
  }

  constructor(scope) {
    this._request = () => scope.request;
    this._response = () => scope.response;
    const methods = getProxyableMethods(this);
    const proxy = new Proxy(this, instanceProxyHandler);
    for (const method of methods) {
      this[method] = this[method].bind(proxy);
    }
    return proxy;
  }

  toJSON() {
    const serialized = {};
    for (const name of Object.getOwnPropertyNames(this)) {
      if (typeof (this[name]) !== 'function' && !name.startsWith('_') && name !== 'attributes') {
        serialized[name] = this[name];
      }
    }
    return serialized;
  }

  render() {
    return false;
  }

}

export default Nullstack;