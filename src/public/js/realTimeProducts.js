const socket = io();
const form = document.getElementById("form");
let productsList;

form.addEventListener('submit', event => {
    event.preventDefault();
    const title = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
    const code = document.getElementById('code').value;
    const stock = document.getElementById('stock').value;
    const newProduct = {
        id: '',
        title, price, description, code, stock
    };
    socket.emit('addProduct', newProduct);
});

function updateProductsUI(products) {
    const productsSection = document.querySelector('.products');
    productsSection.innerHTML = ''; 
    console.log(products)
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            <p><b>Nombre:</b> ${product.title}</p>
            <p><b>Precio:</b> $${product.price}</p>
            <button id="delete" onclick="deleteProduct('${product.id}')">Eliminar</button>
        `;
        productsSection.appendChild(productElement);
    });
}

function deleteProduct(id){
    socket.emit('deleteProducts', id)
}

socket.on('newProducts', data => {
    updateProductsUI(data)
})

