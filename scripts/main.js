import { menuInit, hideMenu } from "/scripts/menu.js";

let currentSong, bookLength;
let map, list;

// główna funkcja
(async () => {
  await menuInit();

  if ("serviceWorker" in navigator)
    navigator.serviceWorker.register("/serviceWorker.js");

  map = await getJSON();

  // create favorite array
  if (!localStorage.getItem("favorite"))
    localStorage.setItem("favorite", JSON.stringify([]));

  eventsListener();
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

  const LSarrow = document.querySelector(".LSarrow");
  const hymnBook = document.getElementById("hymnBook");
  const searchBox = document.getElementById("searchBox");
  const favorite = document.getElementById("addFavorite");
  const arrowLeft = document.getElementById("arrowLeft");
  const arrowRight = document.getElementById("arrowRight");
  const clearButton = document.getElementById("clearButton");
  const randomButton = document.getElementById("randomButton");

  searchBox.addEventListener("focus", () => {
    if (window.screen.width <= 768) {
      document.querySelector(".actionButtons").style.display = "none";
      document.querySelector(".mobileMenu").style.display = "none";
    }
  });
  searchBox.addEventListener("focusout", () => showMobileElements());
  searchBox.addEventListener("keyup", search);

  LSarrow.addEventListener("click", leftSideMenu);
  hymnBook.addEventListener("change", changeHymnBook);
  favorite.addEventListener("click", favoriteFunction);
  arrowLeft.addEventListener("click", prevHymn);
  arrowRight.addEventListener("click", nextHymn);
  clearButton.addEventListener("click", clearSearchBox);
  randomButton.addEventListener("click", randomHymn);
}

function globalShortcuts(e) {
  // console.log(e.keyCode);
  switch (e.keyCode) {
    case 37: // strzałka w lewo
      prevHymn();
      break;
    case 39: // strzałka w prawo
      nextHymn();
      break;
    case 27: // Esc
      document.querySelector(".leftSide").classList.remove("active");
      hideMenu();
      break;
  }
}

function showMobileElements() {
  if (window.screen.width <= 768) {
    document.querySelector(".actionButtons").style.display = "flex";
    document.querySelector(".mobileMenu").style.display = "flex";
  }
}

function leftSideMenu() {
  const menu = document.querySelector(".leftSide");
  const LSbuttons = document.querySelector(".LSbuttons");

  if (!LSbuttons.style.display || LSbuttons.style.display === "none")
    menu.classList.toggle("active");
  else menu.classList.remove("active");
}

// chowanie wyników wyszukiwania, tekst i pokazanie wskazówek przy zmianie śpiewnika
function changeHymnBook() {
  hymnBook.blur();
  clearSearchBox();
}

// mechanizm szukania pieśni
function search(e) {
  searchResults.innerHTML = "";
  searchResults.style.display = "flex";
  clearButton.style.display = "block";

  list = map.get(hymnBook.value);
  bookLength = list.length;

  list.forEach((hymn, index) => {
    if (textFormat(hymn.title).search(textFormat(e.target.value)) != -1) {
      // console.log(hymn.link); // podgląd wszystkich linków raw_github
      const div = document.createElement("div");
      div.setAttribute("id", index);
      div.innerHTML = `${hymn.title}`;
      searchResults.appendChild(div);
      searchResults.appendChild(document.createElement("hr"));

      div.addEventListener("click", selectHymn);
    }
  });

  // usuwanie ostatniego <hr> w wyszukiwarce
  if (searchResults.hasChildNodes()) searchResults.lastChild.remove();

  // jeśli nie ma tekstu w inpucie
  if (e.target.value == "") {
    searchResults.innerHTML = "";
    searchResults.style.display = "none";
    clearButton.style.display = "none";
    showMobileElements();
  }

  // easter egg
  if (e.target.value == "2137") {
    console.log("Jeszcze jak!");

    hymnBook.value = "cegielki";
    list = map.get("cegielki");
    selectHymn(6);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // kliknięcie Enter
  if (e.key === "Enter") {
    try {
      selectHymn(searchResults.firstElementChild.id);
    } catch {
      clearSearchBox();
    }
  }

  // jeśli jest brak wyników
  if (e.target.value !== "" && searchResults.innerHTML == "") {
    let div = document.createElement("div");
    div.style.cursor = "default";
    div.innerHTML = `Brak wyników wyszukiwania`;
    searchResults.appendChild(div);
  }
}

// mechanizm wyświetlania pieśni
async function selectHymn(e) {
  const parser = new DOMParser();

  const title = document.getElementById("title");
  const lyrics = document.getElementById("lyrics");
  const loader = document.querySelector(".loader");
  const titleHolder = document.querySelector(".titleHolder");
  const addFavorite = document.getElementById("addFavorite");
  const arrowLeft = document.getElementById("arrowLeft");
  const arrowRight = document.getElementById("arrowRight");

  let index;
  if (isNaN(e)) index = currentSong = parseInt(e.target.getAttribute("id"));
  else index = currentSong = parseInt(e);

  searchBox.blur(), clearSearchBox(), showMobileElements();

  title.innerHTML = "";
  lyrics.innerHTML = "";

  loader.style.display = "block";
  titleHolder.style.display = "none";
  arrowLeft.style.display = "none";
  randomButton.style.display = "none";
  arrowRight.style.display = "none";

  let xml = await fetch(list[index].link)
    .then((res) => res.text())
    .then((xml) => parser.parseFromString(xml, "text/xml"))
    .catch((err) => console.error(err));

  title.innerHTML = xml.querySelector("title").innerHTML;
  lyrics.innerHTML = lyricsFormat(xml.querySelector("lyrics").innerHTML);

  const star = document.getElementById("star");
  const star_empty = "/files/icons/star_empty.svg";
  const star_filled = "/files/icons/star_filled.svg";

  const array = JSON.parse(localStorage.getItem("favorite"));
  if (array.includes(currentSong)) star.src = star_filled;
  else star.src = star_empty;

  loader.style.display = "none";
  titleHolder.style.display = "flex";
  addFavorite.style.display = "flex";
  arrowLeft.style.display = "flex";
  randomButton.style.display = "flex";
  arrowRight.style.display = "flex";
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

// oczyszczenie tekstu z tagów xml (regexy)
function lyricsFormat(lyrics) {
  return lyrics
    .replace(/\s*(\[V\d*\]|\[C\d*\]|\[K\d*\])\s*/, "")
    .replace(/\s*(\[V\d*\]|\[C\d*\]|\[K\d*\])\s*/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}

// ulubione pieśni
function favoriteFunction() {
  const star = document.getElementById("star");
  const star_empty = "/files/icons/star_empty.svg";
  const star_filled = "/files/icons/star_filled.svg";

  let array = localStorage.getItem("favorite");
  array = JSON.parse(array);
  if (array.includes(currentSong)) {
    array = array.filter((num) => num !== currentSong);
    star.src = star_empty;
  } else {
    star.src = star_filled;
    array.push(currentSong);
  }
  localStorage.setItem("favorite", JSON.stringify(array));
}

// obsługa strzałek
function prevHymn() {
  if (currentSong > 0) {
    selectHymn(currentSong - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function nextHymn() {
  if (currentSong <= bookLength - 2) {
    selectHymn(currentSong + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// random button function
export function randomHymn() {
  list = map.get(hymnBook.value);
  bookLength = list.length;

  const min = Math.ceil(1);
  const max = Math.floor(bookLength);
  const random = Math.floor(Math.random() * (max - min + 1)) + min;
  selectHymn(parseInt(random));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// wciśnięcie przycisku do czyszczenia inputu
function clearSearchBox() {
  searchBox.value = "";
  searchResults.innerHTML = "";
  searchResults.style.display = "none";
  clearButton.style.display = "none";
  showMobileElements();
}
