const form = document.getElementById("artist-form");
const loadButton = document.getElementById("load-btn");
const artistOutput = document.getElementById("artist-output");

const artistNameInput = document.getElementById("artist-name");
const artistNacionalityInput = document.getElementById("artist-nacionalitat");

const formDel = document.getElementById("artist-form-del");
const artistNameDel = document.getElementById("artist-name-del");

const formUpdate = document.getElementById("artist-form-update");
const actualitzaArtist = document.getElementById("artist-name-update");
const nouNom = document.getElementById("artist-name-nou");
const novaNacionalitat = document.getElementById("artist-nacionalitat-nova")

form.addEventListener("submit", async (event) => {
  event.preventDefault();//per defecte recarregaria la pagina així que evitem això.

  const name = artistNameInput.value.trim();
  const nacionalitat = artistNacionalityInput.value.trim();
  if (!name) return;

  const res = await fetch("/api/AddArtist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ data: name, nacionalitat })
  });

  const message = await res.text();
  artistOutput.textContent = message;
  if (res.ok) form.reset();
});

//Consultar els artistes
loadButton.addEventListener("click", async () => {

  let  text = "text a enviar en aquest cas la taula";
  text = "artists";
  // Fem una petició HTTP al servidor (Express)
  // fetch() envia una request al backend
  const res = await fetch("/api/artists", {
    // Tipus de petició
    // POST = enviem dades al servidor
    method: "POST",
    // Capçaleres HTTP
    // Indiquem que estem enviant dades en format JSON
    headers: {
      "Content-Type": "application/json"
    },

    // Cos de la petició (les dades que enviem)
    // Convertim l’objecte JS a text JSON
    body: JSON.stringify({ data: text })
  });

  // El servidor respon amb JSON
  const json = await res.json();
  // Mostrem el resultat a la textarea de sortida
  artistOutput.textContent = JSON.stringify(json.result, null, 2);

});

// Deletar artista
formDel.addEventListener("submit", async (event) => {
  event.preventDefault();//per defecte recarregaria la pagina així que evitem això.

  const name = artistNameDel.value.trim();
  if (!name) return;

  const res = await fetch("/api/DelArtist", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ data: name })
  });

  const message = await res.text();
  artistOutput.textContent = message;
  if (res.ok) formDel.reset();
  
});

// Actualitzar artista
formUpdate.addEventListener("submit", async (event) => {
  event.preventDefault();//per defecte recarregaria la pagina així que evitem això.

  const name = actualitzaArtist.value.trim();
  const newName = nouNom.value.trim();
  const newNacionalitat = novaNacionalitat.value.trim();
  if (!name || !newName) return;

  const res = await fetch("/api/UpdateArtist", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      oldName: name,
      newName,
      newNacionalitat
    })
  });

  const message = await res.text();
  artistOutput.textContent = message;
  if (res.ok) formUpdate.reset();
  
});