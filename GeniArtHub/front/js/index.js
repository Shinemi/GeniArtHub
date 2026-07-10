const productSection = document.querySelector(".products")

class Product{
    constructor(id, shortTitle, title, image) {
    this.id = id;
    this.shortTitle = shortTitle;
    this.title = title;
    this.image = image;
  }

    // Génère et insère le HTML d'une œuvre dans le DOM + transmet l'id du produit dans le lien
    showProducts(){
        const template = `
             <article>
                <img src="${this.image}" alt="${this.title}">
                <a href="product.html?id=${this.id}">Buy ${this.shortTitle}</a>
            </article>
        `
        productSection.insertAdjacentHTML("beforeend",template)       
    }
}


// Récupère tous les produits depuis l'API et les affiche
async function getAllProducts() {
  const url = "http://localhost:3000/api/products/";
  try {
    // Appel API pour récupérer les produits
    const answer = await fetch(url);
    if (!answer.ok) {
      throw new Error(`Statut de réponse : ${answer.status}`); 
    }

    // Parse la réponse JSON et crée une instance Product pour chaque œuvre
    const result = await answer.json();
    console.log(result);
    result.forEach(product => {
        // Instancie chaque produit et l'ajoute au DOM (via l'appel de fonction)
        const newProduct = new Product(product._id, product.shorttitle, product.titre, product.image); 
        newProduct.showProducts(); 
    });

  } catch (erreur) {
    console.error(erreur.message);
  }
}

getAllProducts()