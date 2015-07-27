import Resource from "./Resource";

export class Definitions extends Resource {
  definitions = [];
  securityDefinitions = [];
}

export class Mount extends Resource {
  resources: Resource[] = [];
  mount(resource: Resource) {
    this.assign(resource);
    this.resources.push(resource);
  }
}
