const cartSection = document.getElementById('cart')
const cartItem = document.getElementById('cart-item')
const totalCart = document.getElementById('cart-total-price')
const validateCart = document.getElementById('cart-validate')
const firstname = document.getElementById('firstname')
const lastname = document.getElementById('lastname')
const email = document.getElementById('email')
const address = document.getElementById('address')
const town = document.getElementById('town')

function displayCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        cartItem.textContent = "Votre panier est vide."
        totalCart.textContent = "Total :0.00€"
        return
    }

    cartSection.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {
        const price = parseFloat(item.price);
        const sousTotal = price * item.quantity;
        total += sousTotal;

        const template = `
            <article class="cart-item">
                <h2>${item.title}</h2>
                <img src="${item.image}" alt="${item.title}">
                <p>Format : ${item.format}</p>
                <label for='quantity${index}'>Quantité : </label>
                <input type="number" id="quantity${index}" class="quantity" data-index="${index}"  value="${item.quantity}" min="1">
                <p>Prix unitaire : ${price.toFixed(2)}€</p>
                <p>Sous-total : ${sousTotal.toFixed(2)}€</p>
                <button class="remove-item" data-index="${index}">Supprimer</button>
            </article>
        `;
        cartSection.insertAdjacentHTML("beforeend", template);
    });

    
    totalCart.textContent = `Total du panier : ${total.toFixed(2)}€`;

    document.querySelectorAll(".quantity").forEach(input => {
            input.addEventListener("change", () => {
            const index = input.dataset.index;
            updateQuantity(index, input.value);
        });
        });


    document.querySelectorAll(".remove-item").forEach(button => {
        button.addEventListener("click", () => {
            const index = button.dataset.index;
            removeFromCart(index);
        });
    });
}


function updateQuantity(index, newQuantity) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart[index].quantity = parseInt(newQuantity);
    if (newQuantity < 1){
        //mettre a jour local storage a 1
    } else if (newQuantity > 100){
        //mettre a jour local storage a 100
    } else {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    displayCart();
}


function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}




displayCart()