const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

const productService = require('../../../src/services/products.service')
const productController = require('../../../src/controllers/products.controller');
const mocks = require('./mocks/products.controller.mock');

describe('Testes de unidade do controller de produtos', function () {
  afterEach(sinon.restore);

  describe('Listagem de todos os produtos', function () {
    it('Retorna todos os produtos', async function () {
      const res = {};
      const req = {};
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      sinon
        .stub(productService, 'findAll')
        .resolves({ type: null, message: mocks.allProducts });

      await productController.findAll(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(mocks.allProducts);
    });
  });

  describe('Listagem de produto por ID', function () {
    it('Retorna o produto caso o ID esteja correto', async function () {
      const res = {};
      const req = { params: { id: 1 }, };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      sinon
        .stub(productService, 'findById')
        .resolves({ type: null, message: mocks.productById });

      await productController.findById(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(mocks.productById);
    });

    it('Retorna um erro caso não haja nenhum produto vinculado ao ID passado', async function () {
      const res = {};
      const req = { params: { id: 999 }, };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      sinon
        .stub(productService, 'findById')
        .resolves({ type: 'PRODUCT_NOT_FOUND', message: 'Product not found' });

      await productController.findById(req, res);

      expect(res.status).to.have.been.calledWith(404);
      expect(res.json).to.have.been.calledWith({ message: 'Product not found' });
    });

    it('Retorna um erro caso o ID seja inválido', async function () {
      const res = {};
      const req = { params: { id: 'x' }, };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      sinon
        .stub(productService, 'findById')
        .resolves({ type: 'INVALID_VALUE', message: '"id" must be a number' });

      await productController.findById(req, res);

      expect(res.status).to.have.been.calledWith(422);
      expect(res.json).to.have.been.calledWith({ message: '"id" must be a number' });
    });
  });

  describe('Cadastro de produtos', function () {
    it('Retorna o produto cadastrado', async function () {
      const res = {};
      const req = { body: { name: mocks.newProduct.name }, };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      sinon
        .stub(productService, 'registerProduct')
        .resolves({ type: null, message: mocks.newProduct });

      await productController.registerProduct(req, res);

      expect(res.status).to.have.been.calledWith(201);
      expect(res.json).to.have.been.calledWith(mocks.newProduct);
    });

    it('Retorna um erro caso o nome seja inválido', async function () {
      const res = {};
      const req = { body: { name: 'xxx' }, };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      sinon
        .stub(productService, 'registerProduct')
        .resolves({ type: 'INVALID_VALUE', message: '"name" length must be at least 5 characters long' });

      await productController.registerProduct(req, res);

      expect(res.status).to.have.been.calledWith(422);
      expect(res.json).to.have.been.calledWith({ message: '"name" length must be at least 5 characters long' });
    });
  });

  describe('Atualização de produtos com informações válidas', function () {
    it('Retorna o produto atualizado caso o ID esteja correto', async function () {
      const newValue = 'Martelo do Batman';
      const productId = 1;

      const res = {};
      const req = { params: { id: productId }, body: { name: newValue }, };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      sinon
        .stub(productService, 'updateProduct')
        .resolves({ type: null, message: mocks.updatedProduct });

      await productController.updateProduct(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(mocks.updatedProduct);
    });
  });

  describe('Tentativa de atualização de produtos com informações inválidas', function () {
    it('Retorna um erro caso não haja nenhum produto vinculado ao ID passado', async function () {
      const newValue = 'Martelo do Batman';
      const invalidProductId = 999;
      const errorMessage = 'Product not found';

      const res = {};
      const req = { params: { id: invalidProductId }, body: { name: newValue }, };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      sinon
        .stub(productService, 'updateProduct')
        .resolves({ type: 'PRODUCT_NOT_FOUND', message: errorMessage });

      await productController.updateProduct(req, res);

      expect(res.status).to.have.been.calledWith(404);
      expect(res.json).to.have.been.calledWith({ message: errorMessage });
    });

    it('Retorna um erro caso o ID seja inválido', async function () {
      const newValue = 'Martelo do Batman';
      const invalidProductId = 'x';
      const errorMessage = '"productId" must be a number';

      const res = {};
      const req = { params: { id: invalidProductId }, body: { name: newValue }, };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      sinon
        .stub(productService, 'updateProduct')
        .resolves({ type: 'INVALID_VALUE', message: errorMessage });

      await productController.updateProduct(req, res);

      expect(res.status).to.have.been.calledWith(422);
      expect(res.json).to.have.been.calledWith({ message: errorMessage });
    });

    it('Retorna um erro caso o nome seja inválido', async function () {
      const invalidValue = 'xxx';
      const productId = 1;
      const errorMessage = '"name" length must be at least 5 characters long';

      const res = {};
      const req = { params: { id: productId }, body: { name: invalidValue }, };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      sinon
        .stub(productService, 'updateProduct')
        .resolves({ type: 'INVALID_VALUE', message: errorMessage });

      await productController.updateProduct(req, res);

      expect(res.status).to.have.been.calledWith(422);
      expect(res.json).to.have.been.calledWith({ message: errorMessage });
    });
  });

});