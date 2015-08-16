/// <reference path="../../typings/tsd.d.ts" />
import {expect} from 'chai'
import {inspect} from 'util'
import API from '../../lib/api'

let log = (data) => {
  console.log(inspect(data, {
    showHidden: true,
    colors: true,
    depth: 3
  }));
};

describe('API', () => {

  var handler, api, root;

  beforeEach(() => {
    api = API();
    handler = (req, res, next) => {};
  });

  describe('every resource object', () => {

    var a, b, c;

    beforeEach(function () {
      a = api.path({ basePath: '/v1' });
      b = api.path({ basePath: '/services' });
      c = api.path({ basePath: '/mail' });

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

    describe('#parameters', () => {
      it('should return all parameters definitions from current path', () => {
        let a = api.path({ basePath: '/v1' });
        let b = api.path({ basePath: '/books/:id', parameters: [ api.operation.parameter('id') ] });
        let c = api.operation({ basePath: '/list/:type', parameters: [ api.operation.parameter('type') ], handler: handler });

        a.mount(b);
        b.mount(c);

        expect(b.parameters).to.have.length(1);
        expect(c.parameters).to.have.length(2);
      });
    });

  });

  describe('factory (root object)', () => {
    describe('#mount', () => {

      var a, b;

      it('cannot be assigned to any resource', () => {
        a = api({ basePath: '/v1' });
        b = api.path({ basePath: '/services' });

        expect(() => {
          b.assign(a);
        }).to.throw();
      });
    });
  });

  describe('#path', () => {
    describe('#mount', () => {

      var a, b;

      beforeEach(() => {
        a = api.path({ basePath: '/v1' });
        b = api.path({ basePath: '/services' });

        a.mount(b);
      });

      it('mounts resource by adding it as sub resource', () => {
        expect(a).to.have.deep.property('resources[0]', b);
      });
      it('should set mounting resource as a parent of mounted resource', () => {
        expect(b).to.have.property('parent', a);
      });
      it('should throw exception if mounting path is ambiguous', () => {
        a = api.path({ basePath: '/' });
        b = api.path({ basePath: '/' });
        expect(() => {
          a.mount(b);
        }).to.throw();
      });
    });
  });

  describe('#operation', () => {

    var a, b;

    beforeEach(() => {
      b = api.path({ basePath: '/v1' });
      a = api.operation({
        basePath: '/status/service',
        handler: handler
      });
    });

    describe('#method', () => {
      it('should default to GET', () => {
        expect(a.method).to.equal('GET');
      });
      it('should throw error on unsupported HTTP verb', () => {
        expect(() => {
          a.method = 'X';
        });
        expect(() => {
          api.operation({
            method: 'X',
            handler: handler
          })
        }).to.throw();
      });
    });

    it('should not be added to the list of all operations before mount', () => {
      expect(api.operations.size).to.equal(0);
    });
    it('should be added to the list of all operations after mount', () => {
      b.mount(a);
      expect(api.operations.size).to.equal(1);
    });
    it('should throw error if one of required parameters is not defined', () => {
      b = api.path({ basePath: '/users/:user' });
      a = api.operation({ basePath: '/access/:type', handler: handler });
      expect(a.parameters).to.have.length(0);
      expect(() => {
        b.mount(a);
      }).to.throw();
    });
    it('should throw error if parameter is defined more then once', () => {
      b = api.path({ basePath: '/users/:id', parameters: [ api.operation.parameter('id') ] });
      a = api.operation({ basePath: '/access/:id', parameters: [ api.operation.parameter('id') ], handler: handler });
      expect(() => {
        b.mount(a);
      }).to.throw();
    });

  });

});
