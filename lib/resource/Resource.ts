export default class Resource {

  constructor(basePath:string) {
    this.basePath = basePath;
  }

  private parent:Resource = null;

  private get parents():Resource[] {
    return (this.parent)
      ? this.parent.parents.concat(this)
      : [this];
  }

  /**
   * Mounting point of current resource relative to parent resource.
   * @type {?string}
   */
  basePath:string = null;

  /**
   * Schemas supported by current resource. Combination of http, https, ws, wss.
   * @type {string[]}
   */
  schemas:string[];

  /**
   * Security definitions for current resource.
   * @type {Security}
   */
  //security: Security;

  /**
   * List of accepted MIME types.
   * @see http://tools.ietf.org/html/rfc6838
   * @type {string[]}
   */
  consumes:string[];

  /**
   * List of returned MIME types.
   * @see http://tools.ietf.org/html/rfc6838
   * @type {string[]}
   */
  produces:string[];

  /**
   * Definitions of parameters which may be used by resource's child operations.
   * @type {Parameter[]}
   */
  parameters:string[];

  /**
   * Definitions of responses which may be used by resource's child operations.
   * @type {Response[]}
   */
  responses:string[];

  assign(resource:Resource):void {
    if (this === resource) {
      throw new Error(`Cannot assign resource "${resource.name}" to itself.`);
    }

    if (this.parents.indexOf(resource) !== -1) {
      throw new Error(`Cannot assign parent resource "${resource.name}" to its child resource "${this.name}"`);
    }

    resource.parent = this;
  }

  get name():string {
    return this.path
      .toLowerCase()
      .replace(/\/(\w)/g, (match, letter) => {
        return letter.toUpperCase();
      });
  }

  get path():string {
    return this.parents.map((resource) => {
      return resource.basePath;
    }).join('');
  }
}
