import Resource from "./Resource"
import {Mount, Definitions} from "./Commons"
import {mixin} from "../decorators"

@mixin(Mount, Definitions)
class Root extends Resource implements Mount, Definitions {
  private swagger = '2.0';

  // implement minimal Mount interface to satisfy compiler
  resources: Resource[] = [];
  mount: (resource: Resource) => void;

  // implement minimal Definitions interface to satisfy compiler
  definitions = [];
  securityDefinitions = [];
}

export default Root
