const express = require("express")
const { getAll } = require("../utils/functions")
const fs = require("fs")
const path = require("path")
const router = express.Router()

const finalPath = "../data/carts"
const absolutePath = path.resolve(__dirname, finalPath);

let carts = []

router.get("/:cartId", async (req, res) => {
    const cartId = +req.params.cartId
    try {
        carts = await getAll(absolutePath)
        const result = carts.find(cart => cart.id === cartId)
        if (!result) {
            res.json({ error: true, result: `No se encontro el carrito con id: ${cartId}` })
            return
        }
        res.json(result)
    } catch (error) {
        res.json({ error: true, result: error })
        return
    }
})

router.post("/", async (req, res) => {
    try {
        carts = await getAll(absolutePath)
        const newCart = {
            id: carts.length + 1,
            products: []
        }
        carts.push(newCart)
        await fs.promises.writeFile(absolutePath, JSON.stringify(carts, null, '\t'), 'UTF-8')
        res.json("Carrito creado correctamente.")
    } catch (error) {
        res.json({ error: true, result: error })
    }
})

router.post("/:cartId/product/:pid", async (req, res) => {
    const cartId = +req.params.cartId
    const pid = +req.params.pid
    const productAdd = {
        product: pid,
        quantity: 1
    }
    try {
        carts = await getAll(absolutePath)
        const cart = carts.find(cart => cart.id === cartId)
        if (!cart) {
            return res.json({ error: true, resultado: "Carrito no encontrado" });
        }
        if (cart.products.length === 0) {
            cart.products.push(productAdd)
            try {
                await fs.promises.writeFile(absolutePath, JSON.stringify(carts, null, '\t'), 'UTF-8')
                res.json("Producto añadido correctamente")
                return
            } catch (error) {
                res.json({ error: true, result: error })
            }

        }
        const productIndex = cart.products.findIndex(
            (product) => product.product === pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity++;
        } else {
            cart.products.push(productAdd);
        }

        try {
            await fs.promises.writeFile(absolutePath, JSON.stringify(carts, null, '\t'), 'UTF-8');
            res.json("Producto añadido correctamente.");
        } catch (error) {
            res.json({ error: true, resultado: error });
        }
    } catch (error) {
        res.json({ error: true, result: error })
    }
})

module.exports = router