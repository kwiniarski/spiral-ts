/// <reference path="../node_modules/typescript/bin/lib.es6.d.ts" />
/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/express/express.d.ts" />

import * as express from 'express';

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

type ResourceConfig = string | {
  basePath:string
  name?:string
}

type OperationConfig = ExpressMiddleware | {
  handler:ExpressMiddleware
  basePath?:string
  method?:string
  name?:string
}

type AnyResource = Root | Path | Operation;

class Resource<ConfigType> {

  constructor(config:ConfigType);
  constructor(config:string);
  constructor(config:any) {
    if (typeof config === 'string') {
      this.basePath = config;
    } else {
      for (let key in config) {
        this[key] = config[key];
      }
    }
  }

  private _parent:Resource<ConfigType>;

  public basePath:string = '/';

  protected get parent():Resource<ConfigType> {
    return this._parent;
  }

  protected set parent(resource:Resource<ConfigType>) {
    this._parent = resource;
  }

  private get parents():Array<Resource<ConfigType>> {
    return (this.parent)
      ? this.parent.parents.concat(this)
      : [this];
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
  }
}

class Path extends Resource<ResourceConfig> {
  protected resources:Array<Path|Operation> = [];

  mount(resource:Path|Operation):void {
    this.assign(resource);
    this.resources.push(resource);
  }
}

class Root extends Path {
  protected set parent(resource:AnyResource) {
    throw new Error(`ResourceRoot "${this.name}" cannot have parent resource "${resource.name}"`);
  }
}

import {METHODS} from 'http';

var operations = new Set();

class Operation extends Resource<OperationConfig> {

  constructor(config:OperationConfig) {
    super(config);
    operations.add(this);
  }

  handler:ExpressMiddleware = null;
  private _method:string = 'GET';
  private _parameters:Array<OperationParameter> = [];

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

  parameter(param:OperationParameter) {
    this._parameters.push(param);
  };

}

class OperationParameter {}

function operationFactory(config:OperationConfig):Operation {
  return new Operation(config);
}

namespace operationFactory {
  export let parameter = ():OperationParameter => new OperationParameter();
  export let each = operations.forEach.bind(operations);
}

function apiFactory(config:ResourceConfig):Root {
  return new Root(config);
}

namespace apiFactory {
  export let path = (config:ResourceConfig):Path => new Path(config);
  export let operation = operationFactory
}

let api = apiFactory;

export default api;
