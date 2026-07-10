const productSection = document.querySelector(".detailoeuvre")
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

function truncate(text, maxLength) {
    if (text.length <= maxLength) return text;
    const truncated = text.slice(0, maxLength);
    return truncated.slice(0, truncated.lastIndexOf(" ")) + "...";
}

async function getProduct() {
  const url = `http://localhost:3000/api/products/${productId}`;
  try {
    const answer = await fetch(url);
    if (!answer.ok) {
      throw new Error(`Statut de réponse : ${answer.status}`); 
    }

    const result = await answer.json();
    const defaultPrice = result.declinaisons[0].prix;

    const optionsHTML = result.declinaisons.map(d => 
        `<option value="${d.prix}">${d.taille}</option>`
    ).join("");

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
                <input type="number" name="quantity" id="quantity" placeholder="1" value="1" min="1">
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

    const selectFormat = document.getElementById("format");
    const showPrice = document.querySelector(".showprice");
    const quantity = document.getElementById("quantity");
    const buyButton = document.getElementById("button-buy")

    function updatePrice() {
        showPrice.textContent = `${(selectFormat.value * quantity.value).toFixed(2)}€`;
    }

    selectFormat.addEventListener("change", updatePrice);
    quantity.addEventListener("input", updatePrice);

    buyButton.addEventListener("click", (event) => {
        event.preventDefault();

        const newCartItem = {
            title: result.titre,
            image: result.image,
            shorttitle: result.shorttitle,
            quantity: parseInt(quantity.value),
            format: selectFormat.options[selectFormat.selectedIndex].text,
            price: selectFormat.value
        };

        console.log(newCartItem);

        const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
        existingCart.push(newCartItem);
        localStorage.setItem("cart", JSON.stringify(existingCart));

        window.location.href = "cart.html"; 
    });




  } catch (erreur) {
    console.error(erreur.message);
  }
}

getProduct()