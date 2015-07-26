import {Resource} from "../../lib/resource/Resource"

class Definitions extends Resource {
  resources: Resource[] = [];
  definitions = [];
  securityDefinitions = [];
  mount(resource: Resource) {
    this.assign(resource);
    this.resources.push(resource);
  }
}


@Mixin(Definitions)
export class Root extends Resource implements Definitions {
  private swagger = '2.0';

  // implement minimal Definitions interface to satisfy compiler
  resources: Resource[] = [];
  definitions = [];
  securityDefinitions = [];
  mount: (resource: Resource) => void;
}


function Mixin(...implementations) {
  return (target) => {
    implementations.forEach(implementation => {
      Object.getOwnPropertyNames(implementation.prototype).forEach(property => {
          target.prototype[property] = implementation.prototype[property];
      });
    });
  }
}


