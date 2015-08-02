import ResourcePath from './path';
import ResourceRoot from './root';

export namespace resource {

  export var Path = ResourcePath;
  export var Root = ResourceRoot;

  export function path(options) {
    return new ResourcePath(options)
  }

  export function root(options) {
    return new ResourceRoot(options)
  }
}

