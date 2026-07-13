const orderMessage = document.getElementById("orderMessage");

const params = new URLSearchParams(window.location.search);
const numeroCommande = params.get("numero");

if (numeroCommande) {
    orderMessage.textContent = `Merci pour votre commande ! Voici votre numéro de commande : ${numeroCommande}`;
} else {
    orderMessage.textContent = "Aucune commande trouvée.";
}