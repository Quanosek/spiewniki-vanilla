import { menuInit, showMenu, hideMenu, runSlideshow } from "/scripts/menu.js";
import favoriteMenu, { favList } from "/scripts/favoriteMenu.js";
import themeMenu from "/scripts/themeMenu.js";
import Hymn from "/scripts/hymn.js";

let map, list, hymn;

// główna funkcja
(async () => {
  await menuInit();

  if ("serviceWorker" in navigator)
    navigator.serviceWorker.register("/serviceWorker.js");

  map = await getJSON();
  eventsListener();

  // tworzenie lokalnej tablicy ulubionych pieśni
  if (!localStorage.getItem("favorite")) localStorage.setItem("favorite", "[]");
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
  const epifania = await fetch(`/json/epifania.json`).then((response) => {
    return response.json();
  });
  const inne = await fetch(`/json/inne.json`).then((response) => {
    return response.json();
  });

  let map = new Map();
  map.set("all", brzask.concat(cegielki, nowe, epifania, inne));
  map.set("brzask", brzask);
  map.set("cegielki", cegielki);
  map.set("nowe", nowe);
  map.set("epifania", epifania);
  map.set("inne", inne);
  return map;
}

// słuchanie eventów strony
function eventsListener() {
  let i = -1;

  document.addEventListener("keyup", (e) => {
    i = globalShortcuts(e, i);
  });

  const LSarrow = document.querySelector(".LSarrow");
  const hymnBook = document.getElementById("hymnBook");
  const searchBox = document.getElementById("searchBox");
  const favorite = document.getElementById("addFavorite");
  const arrowLeft = document.getElementById("arrowLeft");
  const arrowRight = document.getElementById("arrowRight");
  const clearButton = document.getElementById("clearButton");
  const randomButton = document.getElementById("randomButton");

  const actionButtons = document.querySelector(".actionButtons");
  const mobileMenu = document.querySelector(".mobileMenu");

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

  searchBox.addEventListener("keyup", search);
  LSarrow.addEventListener("click", leftSideMenu);
  hymnBook.addEventListener("change", changeHymnBook);

  favorite.addEventListener("click", () => {
    map.get("all").find((hymnAll) => {
      if (hymnAll.title.replace(/\s\([^()]*\)*/g, "").includes(hymn.title))
        addFavorite(hymnAll.title.replace(/\s\([^()]*\)*/g, ""));
    });
  });

  arrowLeft.addEventListener("click", prevHymn);
  arrowRight.addEventListener("click", nextHymn);
  clearButton.addEventListener("click", clearSearchBox);
  randomButton.addEventListener("click", randomHymn);

  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
      document.addEventListener("mousemove", handleMouseMove);
      i = -1;
      document.getElementById("sTitle").innerHTML = hymn.title;
      printVerse(i);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
    }
  });
}

// poruszanie myszką przy pokazie slajdów
function handleMouseMove() {
  const slidesStyle = document.querySelector(".slides").style;
  slidesStyle.cursor = "default";
  setTimeout(() => {
    slidesStyle.cursor = "none";
  }, 2000);
}

// skróty klawiszowe
function globalShortcuts(e, i) {
  // console.log(e.keyCode); // podgląd wciskanych klawiszy

  // nawigacja pokazem slajdów
  if (document.querySelector(".slides").style.display === "flex")
    switch (e.keyCode) {
      case 37: // strzałka w lewo
        if (i >= 0) {
          i--;
          if (hymn.presentation) printVerse(hymn.presentation[i]);
          else printVerse(i);
        }
        break;
      case 39: // strzałka w prawo
        if (hymn.presentation) {
          if (i < hymn.presentation.length) {
            i++;
            printVerse(hymn.presentation[i]);
          }
        } else {
          if (i < hymn.verses.length) {
            i++;
            printVerse(i);
          }
        }
        break;
    }
  else {
    // globalne skróty klawiszowe

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
        case 82: // R
          return randomHymn();
        case 83: // S
          return showMenu(), themeMenu();
        case 80: // P
          if (hymn) return runSlideshow();
      }
  }

  return i;
}

// szukanie wersów tekstu pieśni
function printVerse(i) {
  const sTitle = document.getElementById("sTitle");
  const sVerse = document.getElementById("sVerse");

  if (hymn.getVerse(i)) {
    sTitle.classList.add("top");
    sVerse.innerHTML = hymn.getVerse(i);
    document.getElementById("sTitle").innerHTML = hymn.title;
  } else {
    sTitle.classList.remove("top");
    sVerse.innerHTML = "";

    if (i !== -1) sTitle.innerHTML = "";
  }
}

// boczny panel opcji
function leftSideMenu() {
  const menu = document.querySelector(".leftSide");
  const LSbuttons = document.querySelector(".LSbuttons");

  if (!LSbuttons.style.display || LSbuttons.style.display === "none")
    menu.classList.toggle("active");
  else menu.classList.remove("active");
}

// zmiana śpiewnika
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

// podmienienie polskich znaków diakrytycznych
function textFormat(text) {
  return text
    .toLowerCase()
    .replaceAll("ę", "e")
    .replaceAll("ó", "o")
    .replaceAll("ą", "a")
    .replaceAll("ś", "s")
    .replaceAll("ł", "l")
    .replaceAll("ż", "z")
    .replaceAll("ź", "z")
    .replaceAll("ć", "c")
    .replaceAll("ń", "n")
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
  const title = document.getElementById("title");
  const lyrics = document.getElementById("lyrics");
  const loader = document.querySelector(".loader");
  const titleHolder = document.querySelector(".titleHolder");
  const addFavorite = document.getElementById("addFavorite");
  const arrowLeft = document.getElementById("arrowLeft");
  const arrowRight = document.getElementById("arrowRight");

  searchBox.blur();
  clearSearchBox();

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
  if (array.includes(hymn.title)) star.src = star_filled;
  else star.src = star_empty;

  // const textBox = document.querySelector(".textBox");
  // if (
  //   window.screen.height - document.querySelector(".textBox").offsetHeight <=
  //     200 &&
  //   window.screen.width <= 768
  // ) {
  //   textBox.style.marginBottom = "-16%";
  //   textBox.style.paddingBottom = "6rem";
  // } else {
  //   textBox.style.marginBottom = "";
  //   textBox.style.paddingBottom = "";
  // }

  loader.style.display = "none";
  titleHolder.style.display = "flex";
  addFavorite.style.display = "flex";
  arrowLeft.style.display = "flex";
  randomButton.style.display = "flex";
  arrowRight.style.display = "flex";

  Array.from(document.querySelectorAll(".onHymn")).forEach((el) =>
    el.classList.remove("onHymn")
  );
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
  const author = xml.querySelector("author").innerHTML;
  const presentation = xml.querySelector("presentation").innerHTML
    ? xml.querySelector("presentation").innerHTML
    : null;

  hymn = new Hymn(id, title, lyrics, author, presentation);
  return hymn;
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
    if (hymn) if (param.includes(hymn.title)) star.src = star_empty;
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
    // usunięcie znaków specjalnych
    const title = hymn.title.replace(/\s\([^()]*\)*/g, "");
    param = param.replace(/\s\([^()]*\)*/g, "");

    if (title.includes(param)) {
      // elementy HTML
      const handler = document.createElement("div");
      handler.setAttribute("id", index);
      handler.setAttribute("class", "favoriteHandler");

      const song = document.createElement("div");
      song.innerHTML = `${hymn.title}`;
      handler.appendChild(song);

      const del = document.createElement("img");
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

// wyświetlanie poprzedniej pieśni
function prevHymn() {
  if (hymn)
    if (hymn.id > 0) {
      selectHymn(parseInt(hymn.id) - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

// wyświetlanie następnej pieśni
function nextHymn() {
  if (hymn)
    if (hymn.id <= list.length - 2) {
      selectHymn(parseInt(hymn.id) + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
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
