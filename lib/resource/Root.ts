import ResourceBase from './Base'
import {IResourceMountable, IResourceDefinitions} from './Interface'

export default class ResourceRoot extends ResourceBase
implements IResourceMountable<ResourceBase>, IResourceDefinitions {

  definitions = [];

  securityDefinitions = [];

  resources: ResourceBase[] = [];

  mount(resource:ResourceBase):void {
    this.assign(resource);
    this.resources.push(resource);
  }

}

