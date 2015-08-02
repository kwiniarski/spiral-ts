import ResourceBase from './base'
import {IResourceContainer, IResourceDefinitions} from './interface'

class ResourcePath extends ResourceBase implements IResourceContainer<ResourceBase>, IResourceDefinitions {

  definitions = [];

  securityDefinitions = [];

  resources: ResourceBase[] = [];

  mount(resource:ResourceBase):void {
    this.assign(resource);
    this.resources.push(resource);
  }

}

export default ResourcePath
