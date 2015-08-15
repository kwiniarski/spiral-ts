/// <reference path="../../typings/tsd.d.ts" />
import {expect} from 'chai'
import {inspect} from 'util'
import api from '../../lib/api'

let log = (data) => {
  console.log(inspect(data, {
    showHidden: true,
    colors: true,
    depth: 3
  }));
};

describe('API', () => {
  describe('every resource object', () => {

    var a, b, c;

    beforeEach(function () {
      a = api.path('/v1');
      b = api.path('/services');
      c = api.path('/mail');

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

  describe('factory (root object)', () => {
    describe('#mount', () => {

      var a, b;

      it('cannot be assigned to any resource', () => {
        a = api('/v1');
        b = api.path('/services');

        expect(() => {
          b.assign(a);
        }).to.throw();
      });
    });
  });

  describe('#path factory', () => {
    describe('#mount', () => {

      var a, b;

      beforeEach(() => {
        a = api.path('/v1');
        b = api.path('/services');

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

  describe('#operation factory', () => {

    var a, b, handler = (req, res, next) => {};

    beforeEach(() => {
      a = api.operation(handler);
      b = api.path('/');
    });

    describe('#method', () => {
      it('should default to GET', () => {
        expect(a.method).to.equal('GET');
      });
      it('should throw error on unsupported HTTP verb', () => {
        expect(() => {
          a.method = 'X-GET';
        });
        expect(() => {
          api.operation({
            method: 'X-GET',
            handler: handler
          })
        }).to.throw();

      });
    });

    describe('#fetch', () => {
      it('should return all created operations', () => {
        //var x = api.operation.fetch();
        //for (let item of api.operation.fetch()) {
        //  log(item);
        //}
        api.operation.each(item => log(item));

        //log(x.next());
        //log(x.next());
        //log(x.next());
        //log(x.next());
      });
    });

  });

});
