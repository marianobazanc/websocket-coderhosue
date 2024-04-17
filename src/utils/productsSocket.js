const { getAll } = require("./functions");
const path = require("path");
module.exports = function (io) {
    let products = [];
    let finalPath = "../data/products";
    const absolutePath = path.resolve(__dirname, finalPath);

    io.on('connection', async (socket) => {
        try {
            products = await getAll(absolutePath);
        } catch (error) {
            console.error("Error al obtener productos:", error);
        }

        socket.on('addProduct', async data => {
            const newProduct = data;
            data.id = (products.length + 1).toString()
            products.push(newProduct);
            io.emit('newProducts', products);
        });
        socket.on('deleteProducts', async data => {
            console.log("id a eliminar: ",data)
            let productDeleted = products.find(product => {
                return product.id == data
            })
            console.log("producto a eliminar: ",productDeleted)
            let indexDeleted = products.indexOf(productDeleted)
            products.splice(indexDeleted, 1)
            io.emit('newProducts', products)
        }) 

    });

    return function (req, res, next) {
        next();
    };
};
