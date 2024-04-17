const express = require("express");
const router = express.Router();
const { getAll } = require("../utils/functions");
const path = require("path");

let products = [];

let finalPath = "../data/products";
const absolutePath = path.resolve(__dirname, finalPath);

async function loadProducts(req, res, next) {
    try {
        products = await getAll(absolutePath);
        next(); 
    } catch (error) {
        res.render('home', {
            title: 'Productos | Segunda entrega',
            styles: 'home.css',
            error: true,
            products: []
        });
    }
}

router.use('/', loadProducts);

router.get('/', (req, res) => {
    res.render('home', {
        title: 'Productos | Segunda entrega',
        styles: 'home.css',
        error: false,
        products: products
    });
});

router.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts', {
        title: 'Productos en vivo | Segunda entrega',
        styles: 'realTimeProducts.css',
        error: false,
        products: products
    });
});


module.exports = router;
