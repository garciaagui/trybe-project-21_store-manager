const validations = require('./validations/validationsInputValues');
const salesModel = require('../models/sales.model');
const salesProductsModel = require('../models/sales_products.model');

const findAll = async () => {
  const sales = await salesModel.findAll();
  return { type: null, message: sales };
};

const findById = async (saleId) => {
  const error = validations.validateId(saleId);
  if (error.type) return error;

  const sale = await salesModel.findById(saleId);
  if (sale && sale.length) return { type: null, message: sale };
  return { type: 'SALE_NOT_FOUND', message: 'Sale not found' };
};

const saveSalesRelationships = (newSaleId, productsSold) => {
  if (productsSold && productsSold.length > 0) {
    return productsSold.map(async (e) => {
      await salesProductsModel.registerRelationshipSalesProducts(
        newSaleId,
        e.productId,
        e.quantity,
      );
    });
  }
};

const registerSale = async (itemsSold) => {
  const error = await validations.validateSale(itemsSold);
  if (error.type) return error;
  
  const saleId = await salesModel.registerSale();
  
  await Promise.all(saveSalesRelationships(saleId, itemsSold));

  const messageContent = { id: saleId, itemsSold };

  return { type: null, message: messageContent };
};

const deleteSale = async (saleId) => {
  const error = await validations.validateSaleDeletion(saleId);
  if (error.type) return error;

  await salesModel.deleteSale(saleId);

  return { type: null, message: '' };
};

const updateSale = async (saleId, newItemsSold) => {
  const firstCheckError = await validations.validateSaleDeletion(saleId);
  if (firstCheckError.type) return firstCheckError;

  const secondCheckError = await validations.validateSale(newItemsSold);
  if (secondCheckError.type) return secondCheckError;

  await salesProductsModel.deleteRelationshipSalesProducts(saleId);

  await Promise.all(saveSalesRelationships(saleId, newItemsSold));

  const messageContent = { saleId, itemsUpdated: newItemsSold };

  return { type: null, message: messageContent };
};

module.exports = {
  findAll,
  findById,
  saveSalesRelationships,
  registerSale,
  deleteSale,
  updateSale,
};