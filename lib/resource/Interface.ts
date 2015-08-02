export interface IResourceBase<T> {

  /**
   * Mounting point of current resource relative to parent resource.
   * @type {?string}
   */
  basePath:string

  ///**
  // * Schemas supported by current resource. Combination of http, https, ws, wss.
  // * @type {string[]}
  // */
  //schemas:string[]
  //
  ///**
  // * Security definitions for current resource.
  // * @type {Security}
  // */
  //security:Array<{}>
  //
  ///**
  // * List of accepted MIME types.
  // * @see http://tools.ietf.org/html/rfc6838
  // * @type {string[]}
  // */
  //consumes:string[]
  //
  ///**
  // * List of returned MIME types.
  // * @see http://tools.ietf.org/html/rfc6838
  // * @type {string[]}
  // */
  //produces:string[]
  //
  ///**
  // * Definitions of parameters which may be used by resource's child operations.
  // * @type {Parameter[]}
  // */
  //parameters:string[]
  //
  ///**
  // * Definitions of responses which may be used by resource's child operations.
  // * @type {Response[]}
  // */
  //responses:string[]

  /**
   * Resource name
   * @type {string}
   */
  name:string

  /**
   * Resource full path build from basePath's of parent resources
   * and resource itself.
   * @type {string}
   */
  path:string

  /**
   * Sets this resource as a parent of resource given in arguments.
   * @param resource
   */
  assign(resource:T):void
}

/**
 * @interface
 * Defines interface for resources which can have additional definitions.
 * This applies to ResourcePath and ResourceOperation.
 */
export interface IResourceDefinitions {

  /**
   * Array of models definitions.
   * @type {Object[]}
   */
  definitions:Array<{}>

  /**
   * Array of security definitions.
   * @type {Object[]}
   */
  securityDefinitions:Array<{}>
}

/**
 * @interface
 * Defines interface for resources which can mount additional
 * resources. This applies to ResourceRoot and ResourcePath.
 */
export interface IResourceContainer<T> {

  /**
   * List of mounted resources.
   * @type {Array<IResourceBase>}
   */
  resources:Array<T>

  /**
   * Mounts resource under current resource.
   * @param resource {IResourceBase}
   */
  mount(resource:T):void
}
