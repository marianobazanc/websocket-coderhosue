const express = require("express")
const { getAll } = require("../utils/functions")
const fs = require("fs")
const path = require("path");

const router = express.Router()
let products = []
let finalPath = "../data/products"
const absolutePath = path.resolve(__dirname, finalPath);

router.get("/", async (req, res) => {
    const { limit } = req.query
    try {
        const allProducts = await getAll(absolutePath, limit)
        res.json(allProducts)
    } catch (error) {
        res.json(products)
    }
})

router.get("/:productId", async (req, res) => {
    const { productId } = req.params
    try {
        products = await getAll(absolutePath)
        const productFind = products.find((product) => product.id === productId)
        if (!productFind) {
            res.json({ error: true, result: `El producto con id: ${productId} no se encuentra o no existe.` })
            return
        }
        res.json(productFind)
    } catch (error) {

    }
})

router.post("/", async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    if (!title || !description || !code || !price || !status || !stock || !category) {
        res.json({ error: true, result: "Rellene los campos obligatorios." })
        return
    }

    try {
        let products = await getAll(absolutePath);
        const newProduct = {
            id: products.length + 1,
            title,
            description,
            code,
            price,
            status: status || true,
            stock,
            category,
            thumbnails
        };
        if (products.find(producto => producto.code === code)) {
            res.json({ error: true, result: "El codigo ya existe en otro producto." })
            return
        }
        products.push(newProduct);

        await fs.promises.writeFile(absolutePath, JSON.stringify(products, null, '\t'), 'UTF-8');
        res.send("Producto creado correctamente.");
    } catch (error) {
        res.json({ error: true, result: "El producto no pudo ser creado." })
    }
});


router.put("/:productId", async (req, res) => {
    const productId = +req.params.productId
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    const productNew = { title, description, code, price, status, stock, category, thumbnails }
    try {
        const result = await fs.promises.readFile(absolutePath, 'utf-8')
        products = await JSON.parse(result)
        const productIndex = products.findIndex((product) => product.id === productId)
        if (productIndex === -1) {
            res.json({error: true, result: `El producto con id: ${productId} no existe.`})
            return
        }
        products[productIndex] = { ...products[productIndex], ...productNew }
    } catch (error) {
        res.json({error: true, result:` ${error}`})
        return
    }

    try {
        await fs.promises.writeFile(absolutePath, JSON.stringify(products, null, '\t'), 'utf-8')
        res.json("Producto actualizado correctamente")
        return
    } catch (error) {
        res.json({error: true, result: "El producto no se pudo actualizar."})
        return
    }
})

router.delete("/:productId", async (req, res) => {
    const productId = +req.params.productId
    try {
        const result = await fs.promises.readFile(absolutePath, 'utf-8')
        products = await JSON.parse(result)
        const productIndex = products.findIndex((product) => product.id === productId)
        if (productIndex === -1) {
            res.json({error: true, result:`El producto con id: ${productId} no existe.`})
            return
        }
        products.splice(productIndex, 1)
    } catch (error) {
        res.json({error: true, result: `No existe archivo en la ruta especificada. ${error}`})
        return
    }

    try {
        await fs.promises.writeFile(absolutePath, JSON.stringify(products, null, '\t'), 'utf-8')
        res.json("Producto eliminado correctamente")
        return
    } catch (error) {
        res.json({error: true, result:error})
        return
    }
})

module.exports = router