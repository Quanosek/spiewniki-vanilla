import { menuInit, hideMenu } from "/scripts/menu.js";
import { Hymn } from "/scripts/hymn.js";
let map, list, hymn;

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
  // console.log(e.keyCode); // podgląd wciskanych klawiszy
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

  // lista wyszukiwania
  list = map.get(hymnBook.value);

  list.forEach((hymn, index) => {
    if (textFormat(hymn.title).search(textFormat(e.target.value)) != -1) {
      // console.log(hymn.link); // podgląd linków raw_github
      const div = document.createElement("div");
      div.setAttribute("id", index);
      div.innerHTML = `${hymn.title}`;
      searchResults.appendChild(div);
      searchResults.appendChild(document.createElement("hr"));

      div.addEventListener("click", selectHymn.bind(e, index));
    }
  });

  // usuwanie ostatniego <hr> w wyszukiwarce
  if (searchResults.hasChildNodes()) searchResults.lastChild.remove();

  // brak tekstu w wyszukiwarce
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
    list = map.get(hymnBook.value);
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

  // brak wyników wyszukiwania
  if (e.target.value !== "" && searchResults.innerHTML == "") {
    const div = document.createElement("div");
    div.style.cursor = "default";
    div.innerHTML = `Brak wyników wyszukiwania`;
    searchResults.appendChild(div);
  }
}

// mechanizm wyświetlania pieśni
async function selectHymn(id) {
  const title = document.getElementById("title");
  const lyrics = document.getElementById("lyrics");
  const loader = document.querySelector(".loader");
  const titleHolder = document.querySelector(".titleHolder");
  const addFavorite = document.getElementById("addFavorite");
  const arrowLeft = document.getElementById("arrowLeft");
  const arrowRight = document.getElementById("arrowRight");

  searchBox.blur(), clearSearchBox(), showMobileElements();

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

  const star = document.getElementById("star");
  const star_empty = "/files/icons/star_empty.svg";
  const star_filled = "/files/icons/star_filled.svg";

  const array = JSON.parse(localStorage.getItem("favorite"));
  if (array.includes(id)) star.src = star_filled;
  else star.src = star_empty;

  console.log(
    window.screen.height - document.querySelector(".textBox").offsetHeight
  );

  const textBox = document.querySelector(".textBox");
  if (
    window.screen.height - document.querySelector(".textBox").offsetHeight <=
      200 &&
    window.screen.width <= 768
  ) {
    textBox.style.marginBottom = "-16%";
    textBox.style.paddingBottom = "6rem";
  } else {
    textBox.style.marginBottom = "0";
    textBox.style.paddingBottom = "2rem";
  }
  loader.style.display = "none";
  titleHolder.style.display = "flex";
  addFavorite.style.display = "flex";
  arrowLeft.style.display = "flex";
  randomButton.style.display = "flex";
  arrowRight.style.display = "flex";
}

//fetch i formatowanie pieśni
async function getHymn(id) {
  const parser = new DOMParser();
  const xml = await fetch(list[id].link)
    .then((res) => res.text())
    .then((xml) => parser.parseFromString(xml, "text/xml"))
    .catch((err) => console.error(err));

  const title = xml.querySelector("title").innerHTML;
  const lyrics = xml.querySelector("lyrics").innerHTML;
  const presentation = xml.querySelector("presentation").innerHTML
    ? xml.querySelector("presentation").innerHTML
    : null;

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
  const star_empty = "/files/icons/star_empty.svg";
  const star_filled = "/files/icons/star_filled.svg";

  let array = localStorage.getItem("favorite");
  array = JSON.parse(array);
  if (array.includes(hymn.id)) {
    array = array.filter((num) => num !== hymn.id);
    star.src = star_empty;
  } else {
    star.src = star_filled;
    array.push(hymn.id);
  }
  localStorage.setItem("favorite", JSON.stringify(array));
}

// obsługa strzałek
function prevHymn() {
  if (hymn.id > 0) {
    selectHymn(parseInt(hymn.id) - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function nextHymn() {
  if (hymn.id <= list.length - 2) {
    selectHymn(parseInt(hymn.id) + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// random button function
export function randomHymn() {
  list = map.get(hymnBook.value);

  const min = Math.ceil(1);
  const max = Math.floor(list.length);
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
