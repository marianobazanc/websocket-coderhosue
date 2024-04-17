const express = require("express");
const { Server } = require("socket.io");
const handlebars = require("express-handlebars");
const productsRouter = require("./routes/products.route");
const cartsRouter = require("./routes/carts.route");
const viewsRouter = require("./routes/views.route");
const productsSocket = require("./utils/productsSocket");

const app = express();

const httpServer = app.listen(8080, (error) => {
    if (error) {
        console.log(`Error al levantar el servidor. ${error}`);
    }
    console.log(`Servidor activo en puerto: 8080`);
});
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Configuración del motor de plantillas Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views'); // Directorio de plantillas
app.set('view engine', 'handlebars');

// Middleware para la gestión de productos en tiempo real
app.use(productsSocket(io));

// Establecimiento de las rutas
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
