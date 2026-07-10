// La page d'accueil permet d'afficher de manière dynamique toutes les œuvres d'art. Les œuvres affichées sur la page d'accueil proviennent d'un serveur back développé avec NodeJS et Express.

// Le serveur back est fourni avec le projet GeniArtHub.

const productSection = document.querySelector(".products")


class Product{
    constructor(id, shortTitle, title, image) {
    this.id = id;
    this.shortTitle = shortTitle;
    this.title = title;
    this.image = image;
  }

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


async function getAllProducts() {
  const url = "http://localhost:3000/api/products/";
  try {
    const answer = await fetch(url);
    if (!answer.ok) {
      throw new Error(`Statut de réponse : ${answer.status}`); 
    }

    const result = await answer.json();
    console.log(result);
    result.forEach(product => {
        const newProduct = new Product(product._id, product.shorttitle, product.titre, product.image); 
        newProduct.showProducts(); 
    });

  } catch (erreur) {
    console.error(erreur.message);
  }
}


getAllProducts()