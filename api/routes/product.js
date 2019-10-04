const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/product");

const route = express.Router();
//Get all products
route.get("/", (req, res) => {
  Product.find()
    .exec()
    .then(docs => {
      if (docs.length > 0) {
        res.status(200).json({
          count: docs.length,
          message: "List of products",
          products: docs.map(doc => {
            return {
              id: doc._id,
              name: doc.name,
              make: doc.make,
              price: doc.price,
              isrecommended: doc.isrecommended,
              detail: doc.detail
            };
          })
        });
      } else {
        res.status(404).json({
          count: 0,
          message: "There is no products found",
          products: []
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "error occured " + err.message
      });
    });
});

//Create a product
route.post("/", (req, res) => {
  console.log(req.body);
  console.log(req.body.name);
  const product = new Product({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    make: req.body.make,
    price: req.body.price,
    isrecommended: req.body.isrecommended,
    detail: req.body.detail
  });

  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json(result);
    })
    .catch(error => {
      res.status(500).json({
        message: "Error while creating the product",
        error: error
      });
    });
});

//Update a product by a product id
route.put("/:productId", (req, res) => {
  const productId = req.params.productId;
  const updateObject = req.body;
  var query = { _id: productId };
  console.log(productId);
  Product.update(query, { $set: updateObject })
    .exec()
    .then(result => {
      console.log("Data updated successfully");
      res.status(201).json({
        message: "Product updated successfully",
        product: result
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Error while creating the product",
        error: error
      });
    });
});

//Delete a product by a product id
route.delete("/:productId", (req, res) => {
  const productId = req.params.productId;
  Product.remove({ _id: productId })
    .exec()
    .then(result => {
      if (result != null) {
        res.status(200).json({
          message: "Product has been deleted"
        });
      } else {
        res.status(404).json({
          message: "No product found for the given id " + productId
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Error occured while deleting " + error.message
      });
    });
});

//Get a product detail by a product id
route.get("/:productId", (req, res) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .exec()
    .then(doc => {
      if (doc != null) {
        res.status(200).json({
          id: doc._id,
          name: doc.name,
          make: doc.make,
          price: doc.price,
          isrecommended: doc.isrecommended,
          detail: doc.detail
        });
      } else {
        res.status(404).json({
          message: "No product found associated with the id: " + productId
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "Error occured in server " + error
      });
    });
});

module.exports = route;
