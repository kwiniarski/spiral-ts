/// <reference path="../../../typings/tsd.d.ts" />
import {expect} from 'chai'
import ResourceBase from '../../../lib/resource/base'
import ResourcePath from '../../../lib/resource/path'

describe('ResourcePath', () => {
  describe('#mount', () => {

    var a, b;

    beforeEach(() => {
      a = new ResourcePath('/v1');
      b = new ResourceBase('/services');

      a.mount(b);
    });

    it('mounts resource by adding it as sub resource', () => {
      expect(a).to.have.deep.property('resources[0]', b);
    });
    it('should set mounting resource as a parent of mounted resource', () => {
      expect(b).to.have.property('parent', a);
    })
  });
});
