/// <reference path="../node_modules/typescript/bin/lib.es6.d.ts" />
/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/express/express.d.ts" />
/// <reference path="../typings/lodash/lodash.d.ts" />

'use strict';

import * as _ from 'lodash';
import * as express from 'express';
import {METHODS} from 'http';
import {EventEmitter} from 'events';


type ExpressMiddleware = (
  req: express.Request,
  res: express.Response,
  next:(error?:any) => void
) => void;

//interface ResourceInterface {
//  basePath:string
//  name:string
//  path:string
//  assign(resource:ResourceInterface):void
//}

type ResourceConfig = {
  basePath:string
  name?:string
}

type OperationConfig = {
  handler:ExpressMiddleware
  basePath?:string
  method?:string
  name?:string
}

type AnyResource = Root | Path | Operation;

function setupResource<T>(resource:Resource<T>, config:T):void {
  //console.log(resource, config);
  for (let key in config) {
    //console.log('-o->', resource, key, config[key]);
    resource[key] = config[key];
  }
}

function hasDuplicates(a:Array<Object>, b:Array<Object>, using:string = 'name') {
  return _.intersection(_.pluck(a, using), _.pluck(b, using)).length > 0;
}

class Resource<ConfigType> {

  constructor(config:ConfigType) {
    setupResource<ConfigType>(this, config);
  }

  private _parent:Resource<ConfigType>;

  public basePath:string = null;
  protected _parameters:Array<OperationParameter> = [];

  protected get parent():Resource<ConfigType> {
    return this._parent;
  }

  protected set parent(resource:Resource<ConfigType>) {
    this._parent = resource;
  }

  protected get parents():Array<Resource<ConfigType>> {
    return (this.parent)
      ? this.parent.parents.concat(this)
      : [this];
  }

  get parameters():Array<OperationParameter> {
    if (this.parent) {
      return this.parents.reduce((params, resource) => {
        if (hasDuplicates(params, resource._parameters)) {
          throw new Error(`Cannot get parameters while duplicated identifiers are found on path: ${this.path}`);
        }
        return params.concat(resource._parameters);
      }, []);
    } else {
      return this._parameters;
    }
  }

  set parameters(value:Array<OperationParameter>) {
    this._parameters = this._parameters.concat(value);
  }

  get name():string {
    return this.path
      .toLowerCase()
      .replace(/\/(\w)/g, (match, letter) => {
        return letter.toUpperCase();
      });
  }

  get path():string {
    return this.parents.map(resource => resource.basePath).join('');
  }

  // public methods
  assign(resource:Resource<ConfigType>):void {
    if (this === resource) {
      throw new Error(`Cannot assign resource "${resource.name}" to itself.`);
    }

    if (this.parents.indexOf(resource) !== -1) {
      throw new Error(`Cannot assign parent resource "${resource.name}" to its child resource "${this.name}"`);
    }

    resource.parent = this;
    resource.validate();
  }

  protected validate(){}
}

class Path extends Resource<ResourceConfig> {
  protected resources:Array<Path|Operation> = [];

  mount(resource:Path|Operation):void {
    if (resource instanceof Operation === false && this.basePath === resource.basePath) {
      throw new Error(`Cannot mount resource "${resource.name}" under same path as its parent resource`);
    }

    this.assign(resource);
    this.resources.push(resource);

    if (resource instanceof Operation) {
      apiFactory.operations.add(resource);
    }
  }
}

class Root extends Path {
  protected set parent(resource:AnyResource) {
    throw new Error(`Root resource "${this.name}" cannot have parent resource "${resource.name}"`);
  }
}

class Operation extends Resource<OperationConfig> {

  constructor(config:OperationConfig) {
    super(config);
    // TODO: setupResource in overloaded constructors executes twice
    this.handler = config.handler;
    //setupResource(this, config);

  }

  handler:ExpressMiddleware = null;
  private _method:string = 'GET';
  //private _parameters:Array<OperationParameter> = [];

  get method():string {
    return this._method;
  }

  set method(value:string) {
    if (METHODS.indexOf(value) !== -1) {
      this._method = value;
    } else {
      throw new Error(`Unsupported HTTP verb "${value}"`);
    }
  }

  protected validate() {
    let match = this.path.match(/\/:[a-z]+/ig);
    if (match !== null) {
      let params = this.parameters.map(param => param.name);
      match = match.map(holder => holder.replace('/:', ''));
      match.forEach((parameterName) => {
        if (params.indexOf(parameterName) === -1) {
          throw new Error(`Operation on "${this.path}" is missing parameter "${parameterName}" definition`);
        }
      });
    }

    if (typeof this.handler !== 'function') {
      throw new Error(`Operation on "${this.path}" requires handler`);
    }
  }
}

class OperationParameter {
  constructor(public name:string) {

  }
}

function operationFactory(config:OperationConfig):Operation {
  return new Operation(config);
}

namespace operationFactory {
  export let parameter = (v:string):OperationParameter => new OperationParameter(v);
}

function apiFactory(config:ResourceConfig):Root {
  return new Root(config);
}

namespace apiFactory {
  export let path = (config:ResourceConfig):Path => new Path(config);
  export let operation = operationFactory;
  export let operations:Set<Operation>;
}

let API = () => {
  apiFactory.operations = new Set<Operation>();
  return apiFactory;
};

export default API;
