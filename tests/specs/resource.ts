/// <reference path="../../typings/tsd.d.ts" />
import {expect} from "chai"
import {Resource} from "../../lib/resource/Resource"
import {Root} from "../../lib/resource/Root"

var x = new Root('/');
console.log(x);

describe('Resource', () => {

  var a, b, c;

  beforeEach(function () {
    a = new Resource('/v1');
    b = new Resource('/services');
    c = new Resource('/mail');

    a.assign(b);
    b.assign(c);
  });

  it('should return full path build using parents resources basePaths', () => {
    expect(a.path).to.equal('/v1');
    expect(b.path).to.equal('/v1/services');
    expect(c.path).to.equal('/v1/services/mail');
  });

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

  it('should provide name using path', () => {
    expect(a.name).to.equal('V1');
    expect(b.name).to.equal('V1Services');
    expect(c.name).to.equal('V1ServicesMail');
  });
});
