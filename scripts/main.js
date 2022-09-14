let currentSong, // remember current song index number (for arrows)
  bookLength = ""; // remember current book index length (for arrows)

// główna funkcja
async function init() {
  if ("serviceWorker" in navigator)
    navigator.serviceWorker.register("/serviceWorker.js");

  map = await getJSON();
  EventListeners();
  arrows();
}

// fetch spisu pieśni json
async function getJSON() {
  brzask = await fetch(`/json/brzask.json`).then((response) => {
    return response.json();
  });
  cegielki = await fetch(`/json/cegielki.json`).then((response) => {
    return response.json();
  });
  nowe = await fetch(`/json/nowe.json`).then((response) => {
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
function EventListeners() {
  const hymnBook = document.getElementById("hymnBook");
  const searchBox = document.getElementById("searchBox");
  // const favorite = document.getElementById("addFavorite");
  const randomButton = document.getElementById("randomButton");
  const clearButton = document.getElementById("clearButton");

  hymnBook.addEventListener("change", changeHymnBook);
  searchBox.addEventListener("keyup", search);
  // favorite.addEventListener("click", favoriteFunction);
  document.addEventListener("keyup", arrowsGlobal);
  randomButton.addEventListener("click", randomButtonFunction);
  clearButton.addEventListener("click", clearButtonFunction);
}

// chowanie wyników wyszukiwania, tekst i pokazanie wskazówek przy zmianie śpiewnika
function changeHymnBook(e) {
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

      div.addEventListener("click", selectHymn);
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
    selectHymn(6);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // kliknięcie Enter
  if (e.key === "Enter") {
    try {
      selectHymn(searchResults.firstElementChild.id);
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
async function selectHymn(e) {
  const parser = new DOMParser();

  const title = document.querySelector("#title");
  const lyrics = document.querySelector("#lyrics");
  const guide = document.querySelector("#guide");
  const loader = document.querySelector(".loader");
  const titleHolder = document.querySelector(".titleHolder");
  const arrowLeft = document.querySelector("#arrowLeft");
  const arrowRight = document.querySelector("#arrowRight");

  let index;
  if (isNaN(e)) index = currentSong = e.target.getAttribute("id");
  else index = currentSong = e;

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

  let xml = await fetch(list[index].link)
    .then((res) => res.text())
    .then((xml) => parser.parseFromString(xml, "text/xml"))
    .catch((err) => console.error(err));

  title.innerHTML = xml.querySelector("title").innerHTML;
  lyrics.innerHTML = lyricsFormat(xml.querySelector("lyrics").innerHTML);

  loader.style.display = "none";
  titleHolder.style.display = "flex";
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
    .replace(/\s*(\[V\d*\]|\[C\d*\])\s*/, "")
    .replace(/\s*(\[V\d*\]|\[C\d*\])\s*/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
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

// obsługa strzałek

function arrowLeftFunction() {
  if (currentSong > 0) {
    selectHymn(parseInt(currentSong) - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function arrowRightFunction() {
  list = map.get(hymnBook.value);
  bookLength = list.length;

  if (currentSong <= bookLength - 2) {
    selectHymn(parseInt(currentSong) + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// przyciski dolne strzałek
function arrows() {
  document
    .querySelector("#arrowLeft")
    .addEventListener("click", arrowLeftFunction);
  document
    .querySelector("#arrowRight")
    .addEventListener("click", arrowRightFunction);
}

// strzałki klawiatura
function arrowsGlobal(e) {
  if (e.keyCode == "37") arrowLeftFunction();
  if (e.keyCode == "39") arrowRightFunction();
}

// random button function
function randomButtonFunction() {
  list = map.get(hymnBook.value);
  bookLength = list.length;

  min = Math.ceil(1);
  max = Math.floor(bookLength);
  random = Math.floor(Math.random() * (max - min + 1)) + min;
  selectHymn(parseInt(random));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// wciśnięcie przycisku do czyszczenia inputu
function clearButtonFunction() {
  searchBox.value = "";
  searchResults.innerHTML = "";
  searchResults.style.display = "none";
  clearButton.style.display = "none";
}

init();
