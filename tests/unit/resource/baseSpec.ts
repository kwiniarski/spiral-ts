/// <reference path="../../../typings/tsd.d.ts" />
import {expect} from 'chai'
import ResourceBase from '../../../lib/resource/base'

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
