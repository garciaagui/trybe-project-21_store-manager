const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

const salesService = require('../../../src/services/sales.service')
const salesController = require('../../../src/controllers/sales.controller');
const mocks = require('./mocks/sales.controller.mock');

describe('Testes de unidade do controller de vendas', function () {
  afterEach(sinon.restore);

  describe('Listagem de todas as vendas', function () {
    it('Retorna todas as vendas', async function () {
      const res = {};
      const req = {};
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      sinon
        .stub(salesService, 'findAll')
        .resolves({ type: null, message: mocks.allSales });

      await salesController.findAll(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(mocks.allSales);
    });
  });

  describe('Listagem de venda por ID', function () {
    it('Retorna a venda caso o ID esteja correto', async function () {
      const res = {};
      const req = { params: { id: 1 }, };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      sinon
        .stub(salesService, 'findById')
        .resolves({ type: null, message: mocks.saleById });

      await salesController.findById(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(mocks.saleById);
    });

    it('Retorna um erro caso não haja nenhuma venda vinculada ao ID passado', async function () {
      const errorMessage = 'Sale not found';
      const res = {};
      const req = { params: { id: 999 }, };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      sinon
        .stub(salesService, 'findById')
        .resolves({ type: 'SALE_NOT_FOUND', message: errorMessage });

      await salesController.findById(req, res);

      expect(res.status).to.have.been.calledWith(404);
      expect(res.json).to.have.been.calledWith({ message: errorMessage });
    });

    it('Retorna um erro caso o ID seja inválido', async function () {
      const errorMessage = '"id" must be a number';
      const res = {};
      const req = { params: { id: 'x' }, };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      sinon
        .stub(salesService, 'findById')
        .resolves({ type: 'INVALID_VALUE', message: errorMessage });

      await salesController.findById(req, res);

      expect(res.status).to.have.been.calledWith(422);
      expect(res.json).to.have.been.calledWith({ message: errorMessage });
    });
  });

  describe('Cadastro de vendas com informações válidas', function () {
    it('Retorna o produto cadastrado', async function () {
      const res = {};
      const req = mocks.validReq;
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      sinon
        .stub(salesService, 'registerSale')
        .resolves({ type: null, message: mocks.validRes });

      await salesController.registerSale(req, res);

      expect(res.status).to.have.been.calledWith(201);
      expect(res.json).to.have.been.calledWith(mocks.validRes);
    })
  });

  describe('Tentativa de cadastro de vendas com informações inválidas', function () {

    it('Retorna um erro caso alguma quantidade seja inválida', async function () {
      const errorMessage = '"quantity" must be greater than or equal to 1';
      const res = {};
      const req = mocks.reqWithInvalidQuantity;
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      sinon
        .stub(salesService, 'registerSale')
        .resolves({ type: 'INVALID_VALUE', message: errorMessage });

      await salesController.registerSale(req, res);

      expect(res.status).to.have.been.calledWith(422);
      expect(res.json).to.have.been.calledWith({ message: errorMessage });
    });

    it('Retorna um erro caso não haja nenhum produto vinculado a algum ID passado', async function () {
      const errorMessage = 'Product not found';
      const res = {};
      const req = mocks.reqWithInvalidProductId;
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      sinon
        .stub(salesService, 'registerSale')
        .resolves({ type: 'PRODUCT_NOT_FOUND', message: errorMessage });

      await salesController.registerSale(req, res);

      expect(res.status).to.have.been.calledWith(404);
      expect(res.json).to.have.been.calledWith({ message: errorMessage });
    });
  });

  describe('Atualização de vendas com informações válidas', function () {
    it('Retorna a venda atualizada caso o ID esteja correto', async function () {
      const productId = 3;

      const res = {};
      const req = { params: { id: productId }, body: mocks.validReq.body };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      sinon
        .stub(salesService, 'updateSale')
        .resolves({ type: null, message: mocks.validUpdatedRes });

      await salesController.updateSale(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(mocks.validUpdatedRes);
    });
  });

  describe('Tentativa de atualização de vendas com informações inválidas', function () {
    const validSaleId = 1;

    it('Retorna um erro caso alguma quantidade seja inválida', async function () {
      const errorMessage = '"quantity" must be greater than or equal to 1';
      const res = {};
      const req = { params: { id: validSaleId }, body: mocks.reqWithInvalidQuantity.body, };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      sinon
        .stub(salesService, 'updateSale')
        .resolves({ type: 'INVALID_VALUE', message: errorMessage });

      await salesController.updateSale(req, res);

      expect(res.status).to.have.been.calledWith(422);
      expect(res.json).to.have.been.calledWith({ message: errorMessage });
    });

    it('Retorna um erro caso não haja nenhum produto vinculado a algum ID passado', async function () {
      const errorMessage = 'Product not found';
      const res = {};
      const req = { params: { id: validSaleId }, body: mocks.reqWithInvalidProductId.body, };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      sinon
        .stub(salesService, 'updateSale')
        .resolves({ type: 'PRODUCT_NOT_FOUND', message: errorMessage });

      await salesController.updateSale(req, res);

      expect(res.status).to.have.been.calledWith(404);
      expect(res.json).to.have.been.calledWith({ message: errorMessage });
    });

    it('Retorna um erro caso não haja nenhuma venda vinculada ao ID passado', async function () {
      const invalidSaleId = 999;
      const errorMessage = 'Sale not found';

      const res = {};
      const req = { params: { id: invalidSaleId }, body: mocks.validReq.body, };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      sinon
        .stub(salesService, 'updateSale')
        .resolves({ type: 'SALE_NOT_FOUND', message: errorMessage });

      await salesController.updateSale(req, res);

      expect(res.status).to.have.been.calledWith(404);
      expect(res.json).to.have.been.calledWith({ message: errorMessage });
    });

    it('Retorna um erro caso o ID seja inválido', async function () {
      const invalidSaleId = 'x';
      const errorMessage = '"saleId" must be a number';

      const res = {};
      const req = { params: { id: invalidSaleId }, body: mocks.validReq.body, };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      sinon
        .stub(salesService, 'updateSale')
        .resolves({ type: 'INVALID_VALUE', message: errorMessage });

      await salesController.updateSale(req, res);

      expect(res.status).to.have.been.calledWith(422);
      expect(res.json).to.have.been.calledWith({ message: errorMessage });
    });
  });

  describe('Exclusão de vendas com informações válidas', function () {
    it('Retorna nada caso o ID esteja correto', async function () {
      const saleId = 1;

      const res = {};
      const req = { params: { id: saleId } };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      sinon
        .stub(salesService, 'deleteSale')
        .resolves({ type: null, message: '' });

      await salesController.deleteSale(req, res);

      expect(res.status).to.have.been.calledWith(204);
      expect(res.json).to.have.been.calledWith();
    });
  });

  describe('Tentativa de exclusão de vendas com informações inválidas', function () {
    it('Retorna um erro caso não haja nenhuma venda vinculada ao ID passado', async function () {
      const invalidSaleId = 999;
      const errorMessage = 'Sale not found';

      const res = {};
      const req = { params: { id: invalidSaleId } };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      sinon
        .stub(salesService, 'deleteSale')
        .resolves({ type: 'SALE_NOT_FOUND', message: errorMessage });

      await salesController.deleteSale(req, res);

      expect(res.status).to.have.been.calledWith(404);
      expect(res.json).to.have.been.calledWith({ message: errorMessage });
    });

    it('Retorna um erro caso o ID seja inválido', async function () {
      const invalidSaleId = 'x';
      const errorMessage = '"saleId" must be a number';

      const res = {};
      const req = { params: { id: invalidSaleId } };
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      sinon
        .stub(salesService, 'deleteSale')
        .resolves({ type: 'INVALID_VALUE', message: errorMessage });

      await salesController.deleteSale(req, res);

      expect(res.status).to.have.been.calledWith(422);
      expect(res.json).to.have.been.calledWith({ message: errorMessage });
    });
  });

});