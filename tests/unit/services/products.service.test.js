const { expect } = require('chai');
const sinon = require('sinon');

const productModel = require('../../../src/models/products.model');
const productService = require('../../../src/services/products.service')
const mocks = require('./mocks/products.service.mock');

describe('Testes de unidade do service de produtos', function () {
  afterEach(sinon.restore);

  describe('Listagem de todos os produtos', function () {
    it('Retorna todos os produtos', async function () {
      sinon.stub(productModel, 'findAll').resolves(mocks.allProducts);

      const result = await productService.findAll();

      expect(result.message).to.deep.equal(mocks.allProducts);
    });
  });

  describe('Listagem de produto por ID', function () {
    it('Retorna o produto caso o ID esteja correto', async function () {
      sinon.stub(productModel, 'findById').resolves(mocks.productById);

      const result = await productService.findById(1);

      expect(result.type).to.equal(null);
      expect(result.message).to.deep.equal(mocks.productById);
    });

    it('Retorna um erro caso não haja nenhum produto vinculado ao ID passado', async function () {
      sinon.stub(productModel, 'findById').resolves(undefined);

      const result = await productService.findById(999);

      expect(result.type).to.equal('PRODUCT_NOT_FOUND');
      expect(result.message).to.equal('Product not found');
    });

    it('Retorna um erro caso o ID seja inválido', async function () {
      sinon.stub(productModel, 'findById').resolves(undefined);

      const result = await productService.findById('x');

      expect(result.type).to.equal('INVALID_VALUE');
      expect(result.message).to.equal('"id" must be a number');
    });
  });

  describe('Listagem de produtos por nome', function () {
    it('Retorna os produtos cujos nomes possuam o termo pesquisado', async function () {
      sinon.stub(productModel, 'findByName').resolves(mocks.productsByName);

      const result = await productService.findByName('i');

      expect(result.type).to.equal(null);
      expect(result.message).to.deep.equal(mocks.productsByName);
    });

    it('Retorna um array vazio caso não haja produtos cujos nomes possuam o termo pesquisado ', async function () {
      sinon.stub(productModel, 'findByName').resolves([]);

      const result = await productService.findByName('xxx');

      expect(result.type).to.equal(null);
      expect(result.message).to.deep.equal([]);
    });

    it('Retorna todos os produtos caso nenhum termo seja passado', async function () {
      sinon.stub(productModel, 'findByName').resolves(mocks.allProducts);

      const result = await productService.findByName();

      expect(result.type).to.equal(null);
      expect(result.message).to.deep.equal(mocks.allProducts);
    });
  });

  describe('Cadastro de produtos', function () {
    it('Retorna o produto cadastrado', async function () {
      sinon.stub(productModel, 'registerProduct').resolves([{ insertId: 4 }]);
      sinon.stub(productModel, 'findById').resolves(mocks.newProduct);

      const result = await productService.registerProduct(mocks.newProduct.name);

      expect(result.type).to.equal(null);
      expect(result.message).to.deep.equal(mocks.newProduct);
    });

    it('Retorna um erro caso o nome seja inválido', async function () {
      sinon.stub(productModel, 'registerProduct').resolves(undefined);

      const result = await productService.registerProduct('xxx');

      expect(result.type).to.equal('INVALID_VALUE');
      expect(result.message).to.equal('"name" length must be at least 5 characters long');
    });
  });

  describe('Atualização de produtos com informações válidas', function () {
    it('Retorna o produto atualizado caso o ID esteja correto', async function () {
      const newValue = 'Martelo do Batman';
      const productId = 1;
      sinon.stub(productModel, 'updateProduct').resolves([{ affectedRows: 1 }]);
      sinon.stub(productModel, 'findById').resolves(mocks.updatedProduct);

      const result = await productService.updateProduct(newValue, productId);

      expect(result.type).to.equal(null);
      expect(result.message).to.deep.equal(mocks.updatedProduct);
    });
  });

  describe('Tentativa de atualização de produtos com informações inválidas', function () {
    it('Retorna um erro caso não haja nenhum produto vinculado ao ID passado', async function () {
      const newValue = 'Martelo do Batman';
      const invalidProductId = 999;
      sinon.stub(productModel, 'updateProduct').resolves(undefined);

      const result = await productService.updateProduct(newValue, invalidProductId);

      expect(result.type).to.equal('PRODUCT_NOT_FOUND');
      expect(result.message).to.equal('Product not found');
    });

    it('Retorna um erro caso o ID seja inválido', async function () {
      const newValue = 'Martelo do Batman';
      const invalidProductId = 'x';
      sinon.stub(productModel, 'updateProduct').resolves(undefined);

      const result = await productService.updateProduct(newValue, invalidProductId);

      expect(result.type).to.equal('INVALID_VALUE');
      expect(result.message).to.equal('"productId" must be a number');
    });

    it('Retorna um erro caso o nome seja inválido', async function () {
      const invalidValue = 'xxx';
      const productId = 1;
      sinon.stub(productModel, 'updateProduct').resolves(undefined);

      const result = await productService.updateProduct(invalidValue, productId);

      expect(result.type).to.equal('INVALID_VALUE');
      expect(result.message).to.equal('"name" length must be at least 5 characters long');
    });
  });

  describe('Exclusão de produtos com informações válidas', function () {
    it('Retorna nada caso o id seja correto', async function () {
      const productId = 1;

      sinon.stub(productModel, 'deleteProduct').resolves([{ affectedRows: 1 }]);

      const result = await productService.deleteProduct(productId);

      expect(result.type).to.equal(null);
      expect(result.message).to.deep.equal('');
    });
  });

  describe('Tentativa de exclusão de produtos com informações inválidas', function () {
    it('Retorna um erro caso não haja nenhum produto vinculado ao ID passado', async function () {
      const invalidProductId = 999;
      sinon.stub(productModel, 'deleteProduct').resolves(undefined);

      const result = await productService.deleteProduct(invalidProductId);

      expect(result.type).to.equal('PRODUCT_NOT_FOUND');
      expect(result.message).to.equal('Product not found');
    });

    it('Retorna um erro caso o ID seja inválido', async function () {
      const invalidProductId = 'x';
      sinon.stub(productModel, 'deleteProduct').resolves(undefined);

      const result = await productService.deleteProduct(invalidProductId);

      expect(result.type).to.equal('INVALID_VALUE');
      expect(result.message).to.equal('"productId" must be a number');
    });
  });

});
