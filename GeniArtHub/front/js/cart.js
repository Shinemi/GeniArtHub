const cartSection = document.getElementById('cart')
const cartItem = document.getElementById('cart-item')
const totalCart = document.getElementById('cart-total-price')
const validateCart = document.getElementById('cart-validate')
const firstname = document.getElementById('firstname')
const lastname = document.getElementById('lastname')
const email = document.getElementById('email')
const address = document.getElementById('address')
const town = document.getElementById('town')

// Affiche tous les articles du panier avec gestion des quantités et suppression
function displayCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Si le panier est vide, affiche un message
    if (cart.length === 0) {
        cartItem.textContent = "Votre panier est vide."
        totalCart.textContent = "Total :0.00€"
        return
    }

    cartSection.innerHTML = "";

    let total = 0;

    // Génère le HTML pour chaque article du panier
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
                <input type="number" id="quantity${index}" class="quantity" data-index="${index}"  value="${item.quantity}" min="1" max="100">
                <p>Prix unitaire : ${price.toFixed(2)}€</p>
                <p>Sous-total : ${sousTotal.toFixed(2)}€</p>
                <button class="remove-item" data-index="${index}">Supprimer</button>
            </article>
        `;
        cartSection.insertAdjacentHTML("beforeend", template);
    });

    // Affiche le total du panier, limité a 2 chiffres après la virgule
    totalCart.textContent = `Total du panier : ${total.toFixed(2)}€`;

    // Écouteur sur l'input de quantité pour modifier la quantité d'un article
    document.querySelectorAll(".quantity").forEach(input => {
            input.addEventListener("change", () => {
            const index = input.dataset.index;
            updateQuantity(index, input.value);
        });
        });

    // Écouteur pour supprimer un article du panier
    document.querySelectorAll(".remove-item").forEach(button => {
        button.addEventListener("click", () => {
            const index = button.dataset.index;
            removeFromCart(index);
        });
    });
}

// Met à jour la quantité d'un article dans le panier
function updateQuantity(index, newQuantity) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let quantity = parseInt(newQuantity);

    // Valide et maintient la quantité entre 1 et 100
    if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
    } else if (quantity > 100) {
        quantity = 100;
    }

    // Met à jour le panier et le réaffiche (via rappel de fonction)
    cart[index].quantity = quantity;
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

// Supprime un article du panier par son index
function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}


displayCart()