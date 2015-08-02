/// <reference path="../../typings/tsd.d.ts" />
import {expect} from 'chai'
import ResourceBase from '../../lib/resource/Base'
import ResourcePath from '../../lib/resource/Path'

describe('ResourceBase', () => {

  var a, b, c;

  beforeEach(function () {
    a = new ResourceBase('/v1');
    b = new ResourceBase('/services');
    c = new ResourceBase('/mail');

    a.assign(b);
    b.assign(c);
  });

  describe('#path', () => {
    it('should return full path build using parents resources basePaths', () => {
      expect(a.path).to.equal('/v1');
      expect(b.path).to.equal('/v1/services');
      expect(c.path).to.equal('/v1/services/mail');
    });
  });

  describe('#name', () => {
    it('should provide name using path', () => {
      expect(a.name).to.equal('V1');
      expect(b.name).to.equal('V1Services');
      expect(c.name).to.equal('V1ServicesMail');
    });
  });

  describe('#assign', () => {
    it('should throw error while tying to assign parent resource to its child', () => {
      expect(() => {
        c.assign(a);
      }).to.throw(Error);
    });
    it('should throw error while tying to assign resource to itself', () => {
      expect(() => {
        b.assign(b);
      }).to.throw(Error);
    });
  });
});


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
