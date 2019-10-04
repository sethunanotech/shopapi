const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/order');

const route = express();

route.get('/', (req, res) => {
    Order.find()
    .populate('product', 'name')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.count,
            orders: docs.map (doc=>{
                return {
                    id: doc._id,
                    product: doc.product,
                    quantity:doc.quantity
                }
            })
        });
    })
    .catch(error => {
        res.status(500).json({
            message: 'Error occured in the server',
            error: error
        });
    });
});

route.get('/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
    .populate('product')
    .exec()
    .then(doc => {
        if (doc != null){
            res.status(200).json({
                order: doc
            });
        }else{
            res.status(404).json({
                message: 'Order is not found for the id '+ orderId
            });
        }
    })
    .catch(error => {
        res.status(500).json({
            message: 'Error occured in the server',
            error: error
        });
    });
});

route.post('/', (req, res) => {
    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        product: req.body.product,
        quantity: req.body.quantity
    });

    order.save()
    .then(result => {
        res.status(201).json({
            message: 'Order has been created',
            order: result
        });
    })
    .catch(error => {
        res.status(500).json({
            error: error
        });
    });
});

route.delete('/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    Order.remove({_id: orderId}).exec()
    .then(result =>{
        res.status(200).json({
            message: 'Order has been deleted'
        });
    })
    .catch(error => {
        res.status(500).json({
            message: 'Error occured while deleting',
            error: error
        });
    });
});

module.exports = route;