/// <reference path="../../../typings/tsd.d.ts" />
import {expect} from 'chai'
import ResourceBase from '../../../lib/resource/base'
import ResourceRoot from '../../../lib/resource/root'

describe('ResourceRoot', () => {
  describe('#mount', () => {

    var a, b;

    beforeEach(() => {
      a = new ResourceRoot('/v1');
      b = new ResourceBase('/services');

      a.mount(b);
    });

    it('mounts resource by adding it as sub resource', () => {
      expect(a).to.have.deep.property('resources[0]', b);
    });
    it('should set mounting resource as a parent of mounted resource', () => {
      expect(b).to.have.property('parent', a);
    });
    it('cannot be assigned to any resource', () => {
      a = new ResourceRoot('/v1');
      b = new ResourceBase('/services');

      expect(() => {
        b.assign(a);
      }).to.throw();
    });
  });
});
