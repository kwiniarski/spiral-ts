import {IResourceBase} from './Interface';

/**
 * Base Resource class which implements common properties
 * and functionality of resource inheritance.
 * @constructor
 */
export default class ResourceBase implements IResourceBase<ResourceBase> {

  constructor(basePath:string) {
    this.basePath = basePath;
  }

  // private
  private parent:ResourceBase = null;

  private get parents():ResourceBase[] {
    return (this.parent)
      ? this.parent.parents.concat(this)
      : [this];
  }

  // public properties
  basePath:string = null;

  //schemas:string[];
  //
  //security:Array<{}>;
  //
  //consumes:string[];
  //
  //produces:string[];
  //
  //parameters:string[];
  //
  //responses:string[];

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
  assign(resource:ResourceBase):void {
    if (this === resource) {
      throw new Error(`Cannot assign resource "${resource.name}" to itself.`);
    }

    if (this.parents.indexOf(resource) !== -1) {
      throw new Error(`Cannot assign parent resource "${resource.name}" to its child resource "${this.name}"`);
    }

    resource.parent = this;
  }
}

