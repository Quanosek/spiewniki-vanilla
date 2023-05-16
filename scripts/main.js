import { menuInit, showMenu, hideMenu, runSlideshow } from "/scripts/menu.js";
import favoriteMenu, { favList } from "/scripts/favoriteMenu.js";
import { slideEvents, hymnParam } from "/scripts/slideShow.js";
import bookNames from "/scripts/bookNames.js";
import themeMenu from "/scripts/themeMenu.js";
import Hymn from "/scripts/hymn.js";

let map, list, hymn;

// start aplikacji
(async () => {
  // główne skrypty HTML
  await menuInit();
  installPWA();

  // pamięć lokalna ulubionych pieśni
  if (!localStorage.getItem("favorite")) localStorage.setItem("favorite", "[]");

  // główne funkcje
  map = await getJSON();
  appInit();
  slideEvents();
})();

// instalacja PWA
function installPWA() {
  let updated = false;
  let activated = false;

  navigator.serviceWorker.register("/serviceWorker.js").then((registration) => {
    registration.addEventListener("updatefound", () => {
      const worker = registration.installing;
      worker.addEventListener("statechange", () => {
        if (worker.state === "activated") {
          activated = true;
          if (activated && updated) window.location.reload();
        }
      });
    });
  });

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    updated = true;
    if (activated && updated) window.location.reload();
  });
}

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
  const epifania = await fetch(`/json/epifania.json`).then((response) => {
    return response.json();
  });
  const syloe = await fetch(`/json/syloe.json`).then((response) => {
    return response.json();
  });
  const inne = await fetch(`/json/inne.json`).then((response) => {
    return response.json();
  });

  let map = new Map();
  map.set("all", brzask.concat(cegielki, nowe, epifania, syloe, inne));
  map.set("brzask", brzask);
  map.set("cegielki", cegielki);
  map.set("nowe", nowe);
  map.set("epifania", epifania);
  map.set("syloe", syloe);
  map.set("inne", inne);

  return map;
}

// główne eventy aplikacji
function appInit() {
  // globalne skróty klawiszowe
  document.addEventListener("keyup", globalShortcuts);

  // zmiana wybranego śpiewnika
  const hymnBook = document.getElementById("hymnBook");
  hymnBook.addEventListener("change", () => hymnBook.blur(), clearSearchBox());

  // pole wyszukiwania pieśni
  const searchBox = document.getElementById("searchBox");
  const actionButtons = document.querySelector(".actionButtons");
  const mobileMenu = document.querySelector(".mobileMenu");

  searchBox.addEventListener("keyup", search);
  searchBox.addEventListener("focus", () => {
    if (window.screen.width <= 768) {
      actionButtons.style.display = "none";
      mobileMenu.style.display = "none";
    }
  });
  searchBox.addEventListener("focusout", () => {
    actionButtons.style.display = "";
    mobileMenu.style.display = "";
  });

  // zarządzanie ulubionymi
  const favorite = document.getElementById("addFavorite");

  favorite.addEventListener("click", () => {
    map.get("all").find((hymnAll) => {
      hymnAll = textFormat2(hymnAll.title);

      if (hymnAll.includes(hymn.title) || hymn.title.includes(hymnAll)) {
        addFavorite(hymnAll);
      }
    });
  });

  // przyciski funkcyjne
  const arrowLeft = document.getElementById("arrowLeft");
  const arrowRight = document.getElementById("arrowRight");
  const clearButton = document.getElementById("clearButton");
  const randomButton = document.getElementById("randomButton");

  arrowLeft.addEventListener("click", prevHymn);
  arrowRight.addEventListener("click", nextHymn);
  clearButton.addEventListener("click", clearSearchBox);
  randomButton.addEventListener("click", randomHymn);

  // ukryte mnu boczne dla mniejszych ekranów
  const arrow = document.querySelector(".LSarrow");
  const menu = document.querySelector(".leftSide");

  window.addEventListener("click", (e) => {
    if (arrow.contains(e.target)) menu.classList.toggle("active");
    else if (!document.querySelector(".LSbuttons").contains(e.target)) {
      menu.classList.remove("active");
    }
  });
}

// globalne skróty klawiszowe
export function globalShortcuts(e) {
  switch (e.keyCode) {
    case 27: // Esc
      hymnBook.blur(), searchBox.blur();
      clearSearchBox();
      document.querySelector(".leftSide").classList.remove("active");
      hideMenu();
      break;
  }

  if (
    document.activeElement !== searchBox &&
    document.querySelector(".menuHolder").style.visibility !== "visible"
  )
    switch (e.keyCode) {
      case 37: // strzałka w lewo
        return prevHymn();
      case 39: // strzałka w prawo
        return nextHymn();
      case 70: // F
        return showMenu(), favoriteMenu();
      case 80: // P
        if (hymn) runSlideshow();
        break;
      case 82: // R
        return randomHymn();
      case 83: // S
        return showMenu(), themeMenu();
      case 191: // /
        return searchBox.focus();
    }
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
  }

  // easter egg
  if (e.target.value == "2137") {
    console.log("Jeszcze jak!");

    list = map.get((hymnBook.value = "cegielki"));
    selectHymn(6);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Enter
  if (e.keyCode === 13) {
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

// podmienienie polskich znaków diakrytycznych
function textFormat(text) {
  return text
    .toLowerCase()
    .replaceAll("ą", "a")
    .replaceAll("ć", "c")
    .replaceAll("ę", "e")
    .replaceAll("ł", "l")
    .replaceAll("ń", "n")
    .replaceAll("ó", "o")
    .replaceAll("ś", "s")
    .replaceAll("ż", "z")
    .replaceAll("ź", "z")
    .replace(/[^\w\s]/gi, "");
}

// przycisk czyszczący searchBox input
function clearSearchBox() {
  searchBox.value = "";
  searchResults.innerHTML = "";
  searchResults.style.display = "none";
  clearButton.style.display = "none";
}

// mechanizm wyświetlania pieśni
async function selectHymn(id) {
  const loader = document.querySelector(".loader");

  const titleHolder = document.querySelector(".titleHolder");
  const title = document.getElementById("title");
  const addFavorite = document.getElementById("addFavorite");

  const bookName = document.getElementById("bookName");
  const lyrics = document.getElementById("lyrics");

  const hymnCredits = document.getElementById("hymnCredits");
  const copyright = document.getElementById("copyright");
  const author = document.getElementById("author");

  const arrowLeft = document.getElementById("arrowLeft");
  const arrowRight = document.getElementById("arrowRight");

  searchBox.blur(), clearSearchBox();

  loader.style.display = "block";
  titleHolder.style.display = "none";

  title.innerHTML = "";
  bookName.innerHTML = "";
  lyrics.innerHTML = "";
  copyright.innerHTML = "";
  author.innerHTML = "";

  arrowLeft.style.display = "none";
  randomButton.style.display = "none";
  arrowRight.style.display = "none";

  const { book, hymn } = await getHymn(id);
  hymnParam(book, hymn);

  title.innerHTML = hymn.title;
  bookName.innerHTML = bookNames(book);
  hymn.getLyrics().forEach((verse) => {
    const div = document.createElement("div");
    verse.forEach((line) => {
      const text = document.createElement("p");
      if (line.startsWith(" ")) line = line.slice(1);
      if (line.startsWith(".")) {
        line = line.slice(1);
        text.className = "chord";
      }

      text.innerHTML = line;
      div.appendChild(text);
    });
    document.getElementById("lyrics").appendChild(div);
  });

  if (hymn.author || hymn.copyright) hymnCredits.style.display = "flex";
  if (hymn.copyright) copyright.innerHTML = hymn.copyright;
  if (hymn.author) author.innerHTML = hymn.author;

  if (localStorage.getItem("chordsEnabled")) {
    document
      .querySelectorAll(".chord")
      .forEach((line) => (line.style.display = "block"));
  }

  const star = document.getElementById("star");
  const star_empty = "/files/icons/star_empty.svg";
  const star_filled = "/files/icons/star_filled.svg";

  const array = JSON.parse(localStorage.getItem("favorite"));
  if (array.includes(hymn.title)) star.src = star_filled;
  else star.src = star_empty;

  loader.style.display = "none";
  titleHolder.style.display = "flex";
  addFavorite.style.display = "flex";
  arrowLeft.style.display = "flex";
  randomButton.style.display = "flex";
  arrowRight.style.display = "flex";

  Array.from(document.querySelectorAll(".onHymn")).forEach((e) =>
    e.classList.remove("onHymn")
  );
}

//fetch i formatowanie pieśni
async function getHymn(id) {
  const parser = new DOMParser();

  const book = list[id].book;
  const xml = await fetch(list[id].link)
    .then((res) => res.text())
    .then((xml) => parser.parseFromString(xml, "text/xml"))
    .catch((err) => console.log(err));

  const title = xml.querySelector("title").innerHTML;
  const lyrics = xml.querySelector("lyrics").innerHTML;
  const author = xml.querySelector("author").innerHTML;
  const copyright = xml.querySelector("copyright").innerHTML;
  const presentation = xml.querySelector("presentation").innerHTML
    ? xml.querySelector("presentation").innerHTML
    : null;

  hymn = new Hymn(id, title, lyrics, author, copyright, presentation);
  return { book, hymn };
}

// dodawanie/usuwanie ulubionych pieśni
function addFavorite(param) {
  const star = document.getElementById("star");
  const star_empty = "/files/icons/star_empty.svg";
  const star_filled = "/files/icons/star_filled.svg";

  let array = localStorage.getItem("favorite");
  array = JSON.parse(array);

  if (array.includes(param)) {
    array = array.filter((x) => x !== param);
    if (hymn) {
      if (param.includes(hymn.title) || hymn.title.includes(param))
        star.src = star_empty;
    }
  } else {
    star.src = star_filled;
    array.push(param);
  }

  localStorage.setItem("favorite", JSON.stringify(array));
}

// szukanie pieśni po tytule i wyświetlenie w liście
export function searchFavorite(param) {
  list = map.get("all");

  list.forEach((hymn, index) => {
    const title = textFormat2(hymn.title);
    param = textFormat2(param);

    if (title.includes(param)) {
      // elementy HTML
      const handler = document.createElement("div");
      handler.setAttribute("id", index);
      handler.setAttribute("class", "favoriteHandler");

      const song = document.createElement("div");
      song.innerHTML = `${hymn.title}`;
      handler.appendChild(song);

      const del = document.createElement("img");
      del.title = "Kliknij, aby usunąć z ulubionych";
      del.src = "/files/icons/close.svg";
      del.addEventListener("dragstart", (e) => e.preventDefault());
      handler.appendChild(del);

      favoriteList.appendChild(handler);
      favoriteList.appendChild(document.createElement("hr"));

      // zachowanie elementów listy
      del.addEventListener("click", () => {
        addFavorite(title), favList();
      });
      song.addEventListener("click", () => {
        hymnBook.value = "all";
        selectHymn(index), hideMenu();
      });
    }
  });
}

// usunięcie informacji między nawiasami w tekście
function textFormat2(text) {
  return text.replace(/\s\([^()]*\)*/g, "");
}

// wyświetlanie poprzedniej pieśni
function prevHymn() {
  if (hymn) {
    if (hymn.id > 0) {
      selectHymn(parseInt(hymn.id) - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
}

// wyświetlanie następnej pieśni
function nextHymn() {
  if (hymn) {
    if (hymn.id <= list.length - 2) {
      selectHymn(parseInt(hymn.id) + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
}

// wyszukanie losowej pieśni z wybranego śpiewnika
export function randomHymn() {
  list = map.get(hymnBook.value);

  const min = Math.ceil(1);
  const max = Math.floor(list.length) + 1;
  const random = Math.floor(Math.random() * (max - min)) + min;
  selectHymn(parseInt(random));
  window.scrollTo({ top: 0, behavior: "smooth" });
}
