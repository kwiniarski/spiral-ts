import ResourceBase from './Base'
import ResourcePath from './Path'

class ResourceRoot extends ResourcePath {

  definitions = [];

  securityDefinitions = [];

  resources: ResourceBase[] = [];

  mount(resource:ResourceBase):void {
    this.assign(resource);
    this.resources.push(resource);
  }

}

export default ResourceRoot
