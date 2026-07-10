const productSection = document.querySelector(".detailoeuvre")
// Récupère l'ID du produit depuis l'URL (?id=...)
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// Tronque le texte à un nombre de caractères (si un mot est coupé, on tronque jusqu'à la fin du mot)
function truncate(text, maxLength) {
    if (text.length <= maxLength) return text;
    const truncated = text.slice(0, maxLength);
    return truncated.slice(0, truncated.lastIndexOf(" ")) + "...";
}

async function getProduct() {
  const url = `http://localhost:3000/api/products/${productId}`;
  try {
    // Récupère les détails du produit depuis l'API
    const answer = await fetch(url);
    if (!answer.ok) {
      throw new Error(`Statut de réponse : ${answer.status}`); 
    }

    const result = await answer.json();
    // Récupère le prix de la première déclinaison par défaut
    const defaultPrice = result.declinaisons[0].prix;

    // Génère les options du select avec les tailles et prix disponibles
    const optionsHTML = result.declinaisons.map(d => 
        `<option value="${d.prix}">${d.taille}</option>`
    ).join("");

    // Template HTML du détail produit avec image, description, prix, etc.
    const template = `
        <article>
            <figure>
                <img src="${result.image}" alt="${result.titre}">
            </figure>
            <div>
                <h1>${result.titre}</h1>
                <p>${truncate(result.description, 150)}</p>
                <div class="price">
                    <p>Acheter pour</p>
                    <span class="showprice">${defaultPrice}€</span>
                </div>
                <div class="declinaison">
                    <input type="number" name="quantity" id="quantity" placeholder="1" value="1" min="1" max="100">
                    <select name="format" id="format">
                        ${optionsHTML}
                    </select>
                </div>
                <a class="button-buy" id='button-buy' href="cart.html">Buy ${result.shorttitle}</a>
            </div>
        </article>

        <aside>
            <h2>Description de l'oeuvre : ${result.titre}</h2>
            <p>${result.description}</p>
        </aside>
    `
    productSection.insertAdjacentHTML("beforeend", template)

    // éléments du DOM pour gérer les interactions
    const selectFormat = document.getElementById("format");
    const showPrice = document.querySelector(".showprice");
    const quantity = document.getElementById("quantity");
    const buyButton = document.getElementById("button-buy")

    // Met à jour le prix affiché en fonction de la quantité et du format sélectionné
    function updatePrice() {
        showPrice.textContent = `${(selectFormat.value * quantity.value).toFixed(2)}€`;
    }

    // Écouteurs pour les changements de format ou quantité
    selectFormat.addEventListener("change", updatePrice);
    quantity.addEventListener("input", updatePrice);

    // Ajoute le produit au panier au clic du bouton "Buy"
    buyButton.addEventListener("click", (event) => {
        event.preventDefault();

        // Valide et maintient la quantité entre 1 et 100
        let newQuantity = parseInt(quantity.value);
        if (isNaN(newQuantity) || newQuantity < 1) {
            newQuantity = 1;
        } else if (newQuantity > 100) {
            newQuantity = 100;
        }

        // Récupère le texte du format sélectionné 
        const newFormat = selectFormat.options[selectFormat.selectedIndex].text;

        // Récupère le panier existant depuis localStorage
        const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

        // Vérifie si le produit avec ce format existe déjà dans le panier
        const existingItemIndex = existingCart.findIndex(item => 
            item.id === result._id && item.format === newFormat
        );

        if (existingItemIndex !== -1) {
            // Si oui, additionne les quantités (max 100)
            let totalQuantity = existingCart[existingItemIndex].quantity + newQuantity;
            if (totalQuantity > 100) totalQuantity = 100;
            existingCart[existingItemIndex].quantity = totalQuantity;
        } else {
            // Sinon, crée un nouvel article dans le panier
            const newCartItem = {
                id: result._id,
                title: result.titre,
                image: result.image,
                shorttitle: result.shorttitle,
                quantity: newQuantity,
                format: newFormat,
                price: selectFormat.value
            };
            existingCart.push(newCartItem);
        }

        console.log(existingCart);

        // Sauvegarde le panier mis à jour dans localStorage
        localStorage.setItem("cart", JSON.stringify(existingCart));
        // Redirige vers la page panier
        window.location.href = "cart.html"; 
    });



  } catch (erreur) {
    console.error(erreur.message);
  }
}

getProduct()