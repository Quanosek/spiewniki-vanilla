import { showMenu, hideMenu } from "/scripts/menu.js?v=1";
import { Hymn } from "/scripts/hymn.js";

let bookLength;
let map, list, hymn;

// główna funkcja
(async () => {
  if ("serviceWorker" in navigator)
    navigator.serviceWorker.register("/serviceWorker.js");

  map = await getJSON();
  eventsListener();
  arrows();
})();

// fetch spisu pieśni json
async function getJSON() {
  const brzask = await fetch(`/json/brzask.json`).then((response) => {
    return response.json();
  });
  const cegielki = await fetch(`/json/cegielki.json`).then((response) => {
    return response.json();
  });
  const nowe = await fetch(`/json/nowe.json`).then((response) => {
    return response.json();
  });

  let map = new Map();
  map.set("all", brzask.concat(cegielki, nowe));
  map.set("brzask", brzask);
  map.set("cegielki", cegielki);
  map.set("nowe", nowe);
  return map;
}

// dodawanie wszystkich eventListenerów
function eventsListener() {
  document.addEventListener("keyup", globalShortcuts);

  const hymnBook = document.getElementById("hymnBook");
  const searchBox = document.getElementById("searchBox");
  // const favorite = document.getElementById("addFavorite");
  const randomButton = document.getElementById("randomButton");
  const clearButton = document.getElementById("clearButton");

  hymnBook.addEventListener("change", changeHymnBook);
  searchBox.addEventListener("keyup", search);
  // favorite.addEventListener("click", favoriteFunction);
  randomButton.addEventListener("click", randomButtonFunction);
  clearButton.addEventListener("click", clearButtonFunction);
}

function globalShortcuts(e) {
  // console.log(e.keyCode);
  switch (e.keyCode) {
    case 37: // strzałka w lewo
      arrowLeftFunction();
      break;
    case 39: // strzałka w prawo
      arrowRightFunction();
      break;
    case 27: // Esc
      hideMenu();
      break;
    case 85: // R
      showMenu();
      break;
    case 87: // W
      randomButtonFunction();
      break;
  }
}

// chowanie wyników wyszukiwania, tekst i pokazanie wskazówek przy zmianie śpiewnika
function changeHymnBook() {
  hymnBook.blur();
  clearButtonFunction();
}

// mechanizm szukania pieśni
function search(e) {
  searchResults.innerHTML = "";
  searchResults.style.display = "block";
  clearButton.style.display = "block";

  list = map.get(hymnBook.value);
  bookLength = list.length;

  list.forEach((hymn, index) => {
    if (textFormat(hymn.title).search(textFormat(e.target.value)) != -1) {
      // console.log(hymn.link); // podgląd wszystkich linków raw_github
      let div = document.createElement("div");
      div.setAttribute("id", index);
      div.style.margin = "1rem";
      div.innerHTML = `${hymn.title}<hr>`;
      searchResults.appendChild(div);

      div.addEventListener("click", selectHymn.bind(null, e, index));
    }
  });

  // usuwanie ostatniego <hr> w wyszukiwarce
  if (searchResults.hasChildNodes()) searchResults.lastChild.lastChild.remove();

  // jeśli nie ma tekstu w inpucie
  if (e.target.value == "") {
    searchResults.innerHTML = "";
    searchResults.style.display = "none";
    clearButton.style.display = "none";
  }

  // easter egg
  if (e.target.value == "2137") {
    console.log("Jeszcze jak!");

    hymnBook.value = "cegielki";
    list = map.get("cegielki");
    selectHymn(null, 6);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // kliknięcie Enter
  if (e.key === "Enter") {
    try {
      selectHymn(null, searchResults.firstElementChild.id);
    } catch {
      clearButtonFunction();
    }
  }

  // jeśli jest brak wyników
  if (e.target.value !== "" && searchResults.innerHTML == "") {
    let div = document.createElement("div");
    div.style.margin = "1rem";
    div.style.cursor = "default";
    div.innerHTML = `Brak wyników wyszukiwania`;
    searchResults.appendChild(div);
  }
}

// mechanizm wyświetlania pieśni
async function selectHymn(e, id) {
  const parser = new DOMParser();

  const title = document.querySelector("#title");
  const lyrics = document.querySelector("#lyrics");
  const guide = document.querySelector("#guide");
  const loader = document.querySelector(".loader");
  const titleHolder = document.querySelector(".titleHolder");
  const arrowLeft = document.querySelector("#arrowLeft");
  const arrowRight = document.querySelector("#arrowRight");

  searchBox.blur();
  clearButtonFunction();

  guide.style.display = "none";

  title.innerHTML = "";
  lyrics.innerHTML = "";

  loader.style.display = "block";
  titleHolder.style.display = "none";
  arrowLeft.style.display = "none";
  randomButton.style.display = "none";
  arrowRight.style.display = "none";

  hymn = await getHymn(id);

  title.innerHTML = hymn.title;
  lyrics.innerHTML = hymn.getLyrics();

  loader.style.display = "none";
  titleHolder.style.display = "flex";
  arrowLeft.style.display = "flex";
  randomButton.style.display = "flex";
  arrowRight.style.display = "flex";
}

//fetch i formatowanie pieśni
async function getHymn(id) {
  const parser = new DOMParser();
  let xml = await fetch(list[id].link)
    .then((res) => res.text())
    .then((xml) => parser.parseFromString(xml, "text/xml"))
    .catch((err) => console.error(err));

  let title = xml.querySelector("title").innerHTML;
  let lyrics = xml.querySelector("lyrics").innerHTML;
  let presentation = xml.querySelector("presentation").innerHTML ? xml.querySelector("presentation").innerHTML : null;

  hymn = new Hymn(id, title, lyrics, presentation);
  return hymn;
}

// podmienienie polskich znaków diakrytycznych
function textFormat(text) {
  return text
    .replace("ę", "e")
    .replace("ó", "o")
    .replace("ą", "a")
    .replace("ś", "s")
    .replace("ł", "l")
    .replace("ż", "z")
    .replace("ź", "z")
    .replace("ć", "c")
    .replace("ń", "n")
    .replace(/[^\w\s]/gi, "")
    .toLowerCase();
}

// ulubione pieśni
function favoriteFunction() {
  const star = document.getElementById("star");
  const star_empty = 'url("/files/icons/star_empty.svg")';
  const star_filled = 'url("/files/icons/star_filled.svg")';

  if (
    !star.style.backgroundImage ||
    star.style.backgroundImage === star_empty
  ) {
    star.style.backgroundImage = star_filled;
    // console.log("Added to favorite songs!");

    //
    // code here
    //
  } else {
    star.style.backgroundImage = star_empty;
    // console.log("Removed from favorite songs!");

    //
    // code here
    //
  }
}

// przyciski dolne strzałek
function arrows() {
  const arrowLeft = document.getElementById("arrowLeft");
  const arrowRight = document.getElementById("arrowRight");
  arrowLeft.addEventListener("click", arrowLeftFunction);
  arrowRight.addEventListener("click", arrowRightFunction);
}

// obsługa strzałek
function arrowLeftFunction() {
  if (hymn.id > 0) {
    selectHymn(null, parseInt(hymn.id) - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function arrowRightFunction() {
  if (hymn.id <= bookLength - 2) {
    selectHymn(null, parseInt(hymn.id) + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// random button function
function randomButtonFunction() {
  list = map.get(hymnBook.value);
  bookLength = list.length;

  const min = Math.ceil(1);
  const max = Math.floor(bookLength);
  const random = Math.floor(Math.random() * (max - min + 1)) + min;
  selectHymn(null, parseInt(random));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// wciśnięcie przycisku do czyszczenia inputu
function clearButtonFunction() {
  searchBox.value = "";
  searchResults.innerHTML = "";
  searchResults.style.display = "none";
  clearButton.style.display = "none";
}
