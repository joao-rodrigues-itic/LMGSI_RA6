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

//Crear nou artista
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

  let  text = "artists";
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

//--------------------------------------------------------------------------------------
const formAlbumAdd = document.getElementById("album-form-create");
const albumNameInput = document.getElementById("album-name");
const albumYearInput = document.getElementById("album-year");

const loadAlbumButton = document.getElementById("get-albuns");
const albumOutput = document.getElementById("album-output");

const formDelAlbum = document.getElementById("album-form-del");
const albumNameDel = document.getElementById("album-name-del");

const albumArtistsSelect = document.getElementById("album-artists");

// Funcció per carregar artistes en select
async function loadArtistsToSelect() {
  const res = await fetch("/api/artists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: "artists" })
  });
  const json = await res.json();
  
  albumArtistsSelect.innerHTML = ""; // Limpa opções atuais
  json.result.forEach(artist => {
    const option = document.createElement("option");
    option.value = artist.id;
    option.textContent = artist.name;
    albumArtistsSelect.appendChild(option);
  });
}

// Carregar en iniciar
loadArtistsToSelect();

//Crear nou album
formAlbumAdd.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = albumNameInput.value.trim();
  const year = albumYearInput.value.trim();
  
  // Captura els IDs dels artistes selecionats en select multiple
  const selectedArtists = Array.from(albumArtistsSelect.selectedOptions).map(opt => opt.value);

  if (!name || !year) return;

  const res = await fetch("/api/AddAlbum", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      name, 
      year, 
      artistIds: selectedArtists // Enviar els IDs per al backend
    })
  });

  const message = await res.text();
  albumOutput.textContent = message;
  if (res.ok) {
    formAlbumAdd.reset();
    loadArtistsToSelect(); // Recarrega per garantitzar la sincronia
  }
});

//Consultar els albums
loadAlbumButton.addEventListener("click", async () => {

  let text = "albumes";
  const res = await fetch("/api/albumes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({ data: text })
  });

  const json = await res.json();
  albumOutput.textContent = JSON.stringify(json.result, null, 2);

});

// Deletar album
formDelAlbum.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = albumNameDel.value.trim();
  if (!name) return;

  const res = await fetch("/api/DelAlbum", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ data: name })
  });

  const message = await res.text();
  albumOutput.textContent = message;
  if (res.ok) formDelAlbum.reset();
  
});

//--------------------------------------------------------------------------------------

const formCancoAdd = document.getElementById("canco-form-create");
const cancoNameInput = document.getElementById("canco-name");
const cancoDurationInput = document.getElementById("canco-duration");

const loadCanconsButton = document.getElementById("get-cancons");
const cancoOutput = document.getElementById("canco-output");

const formDelCanco = document.getElementById("canco-form-del");
const cancoNameDel = document.getElementById("canco-name-del");

const artistsCanconsSelect = document.getElementById("artists_cancons");
const albumesCanconsSelect = document.getElementById("albumes_cancons");

// Funcio per carregar els selects de artistes i cancons
async function loadDataForSongs() {
  // Carregar Artistas
  const resArtists = await fetch("/api/artists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: "artists" })
  });
  if (!resArtists.ok) {
    console.error("Error en carregar artistes:", resArtists.status);
    return;
  }
  const artists = await resArtists.json();
  console.log("Artistes carregats:", artists);
  
  artistsCanconsSelect.innerHTML = "";
  artists.result.forEach(a => {
    artistsCanconsSelect.innerHTML += `<option value="${a.id}">${a.name}</option>`;
  });

  // Carregar Álbuns
  const resAlbums = await fetch("/api/albumes", { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: "albumes" })
  });
  if (!resAlbums.ok) {
    console.error("Erro ao carregar albumes:", resAlbums.status);
    return;
  }
  const albums = await resAlbums.json();
  console.log("Albumes carregats:", albums);

  albumesCanconsSelect.innerHTML = "";
  albums.result.forEach(al => {
    albumesCanconsSelect.innerHTML += `<option value="${al.id}">${al.name}</option>`;
  });
}

// Crear nova canço
formCancoAdd.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = cancoNameInput.value.trim();
  const duration = cancoDurationInput.value.trim();
  const selectedArtists = Array.from(artistsCanconsSelect.selectedOptions).map(opt => opt.value);
  const selectedAlbums = Array.from(albumesCanconsSelect.selectedOptions).map(opt => opt.value);

  const res = await fetch("/api/AddCanco", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      name, 
      duration, 
      artistIds: selectedArtists, 
      albumIds: selectedAlbums 
    })
  });

  cancoOutput.textContent = await res.text();
  if (res.ok) formCancoAdd.reset();
});

// Recarregar la pàgina
if (formCancoAdd) loadDataForSongs();

// Consultar cançons
loadCanconsButton.addEventListener("click", async () => {

  let text = "canco";
  const res = await fetch("/api/cancons", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({ data: text })
  });

  const json = await res.json();
  cancoOutput.textContent = JSON.stringify(json.result, null, 2);

});

// Deletar album
formDelCanco.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = cancoNameDel.value.trim();
  if (!name) return;

  const res = await fetch("/api/DelCanco", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ data: name })
  });

  const message = await res.text();
  cancoOutput.textContent = message;
  if (res.ok) formDelCanco.reset();
  
});

