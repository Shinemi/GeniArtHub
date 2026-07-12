const cartSection = document.getElementById('cart')
const cartItem = document.getElementById('cartItem')       
const totalCart = document.getElementById('cartTotalPrice') 
const validateCart = document.getElementById('cartValidate') 
const firstname = document.getElementById('firstname')
const lastname = document.getElementById('lastname')
const email = document.getElementById('email')
const address = document.getElementById('address')
const town = document.getElementById('town')

// Affiche tous les articles du panier avec gestion des quantités et suppression
async function displayCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || []

    // Si le panier est vide, affiche un message
    if (cart.length === 0) {
        cartItem.textContent = "Votre panier est vide."
        totalCart.textContent = "Total :0.00€"
        return
    }

    cartSection.innerHTML = ""

    let total = 0

    // On récupère le prix à jour pour chaque article, un par un
    const cartWithPrices = []

    for (const item of cart) {
        const answer = await fetch(`http://localhost:3000/api/products/${item.id}`)
        const product = await answer.json()
        const declinaison = product.declinaisons.find(d => d.taille === item.format)
        const price = declinaison ? declinaison.prix : 0
        
        cartWithPrices.push({ ...item, price })
    }

    cartWithPrices.forEach((item, index) => {
    const sousTotal = item.price * item.quantity
    total += sousTotal

    const template = `
        <article class="cartItemCard">
                <img src="${item.image}" alt="${item.title}">
                <h2>${item.title}</h2>
                <div class="cartItemDetails">
                    <p>Format : ${item.format}</p>
                    <div>
                        <label for='quantity${index}'>Quantité :</label>
                        <input type="number" id="quantity${index}" class="quantity" data-index="${index}" value="${item.quantity}" min="1" max="100">
                    </div>
                    <p>Prix unitaire : ${item.price.toFixed(2)}€</p>
                    <p>Sous-total : ${sousTotal.toFixed(2)}€</p>
                </div>
                <button class="removeItem" data-index="${index}">Supprimer</button>
            </article>
    `
    cartSection.insertAdjacentHTML("beforeend", template)
    })

    // Affiche le total du panier, limité a 2 chiffres après la virgule
    totalCart.textContent = `Total du panier : ${total.toFixed(2)}€`

    // Écouteur sur l'input de quantité pour modifier la quantité d'un article
    document.querySelectorAll(".quantity").forEach(input => {
            input.addEventListener("change", () => {
            const index = input.dataset.index
            updateQuantity(index, input.value)
        })
        })

    // Écouteur pour supprimer un article du panier
    document.querySelectorAll(".remove-item").forEach(button => {
        button.addEventListener("click", () => {
            const index = button.dataset.index
            removeFromCart(index)
        })
    })

    // Écouteur pour la validation de commande
    validateCart.addEventListener("click", async (event) => {
       
        event.preventDefault()

        const errors = []

        const nameRegex = /^[a-zA-ZÀ-ÿ\s-]{2,}$/
        // Prénom : minimum 2 lettres, pas de caractères spéciaux
        if (!nameRegex.test(firstname.value.trim())) {
            errors.push("Le prénom doit contenir au moins 2 lettres, sans caractères spéciaux.")
        }

        // Nom : minimum 2 lettres, pas de caractères spéciaux
        if (!nameRegex.test(lastname.value.trim())) {
            errors.push("Le nom doit contenir au moins 2 lettres, sans caractères spéciaux.")
        }

        // Adresse : au moins 10 caractères
        if (address.value.trim().length < 10) {
            errors.push("L'adresse doit contenir au moins 10 caractères.")
        }

        // Ville : au moins 3 caractères, pas de chiffres
        const townRegex = /^[a-zA-ZÀ-ÿ\s-]{3,}$/
        if (!townRegex.test(town.value.trim())) {
            errors.push("La ville doit contenir au moins 3 caractères, sans chiffres.")
        }

        // Email : format valide
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email.value.trim())) {
            errors.push("L'adresse email n'est pas valide.")
        }

        // Panier non vide
        const cart = JSON.parse(localStorage.getItem("cart")) || []
        if (cart.length === 0) {
            errors.push("Votre panier est vide.")
        }

        // Affichage des erreurs 
        if (errors.length > 0) {
            displayFormErrors(errors)
            return
        }

        // Tout est valide : on peut "passer commande"
        clearFormErrors();
        const 
        const answerOrder = await fetch(`http://localhost:3000/api/products/order`)
        console.log(answerOrder)
    })
}

// Met à jour la quantité d'un article dans le panier
function updateQuantity(index, newQuantity) {
    const cart = JSON.parse(localStorage.getItem("cart")) || []
    let quantity = parseInt(newQuantity)

    // Valide et maintient la quantité entre 1 et 100
    if (isNaN(quantity) || quantity < 1) {
        quantity = 1
    } else if (quantity > 100) {
        quantity = 100
    }

    // Met à jour le panier et le réaffiche (via rappel de fonction)
    cart[index].quantity = quantity
    localStorage.setItem("cart", JSON.stringify(cart))
    displayCart()
}

// Supprime un article du panier par son index
function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || []
    cart.splice(index, 1)
    localStorage.setItem("cart", JSON.stringify(cart))
    displayCart()
}

// Affiche les erreurs de formulaire
function displayFormErrors(errors) {
    clearFormErrors();
    const errorBlock = document.createElement("div");
    errorBlock.id = "formErrors";
    errorBlock.innerHTML = errors.map(err => `<p>${err}</p>`).join("");
    validateCart.insertAdjacentElement("beforebegin", errorBlock);
}

// Supprime les messages d'erreurs de formulaire
function clearFormErrors() {
    const existingErrors = document.getElementById("formErrors");
    if (existingErrors) existingErrors.remove();
}


displayCart()