//główna funkcja
async function init() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("/serviceWorker.js")
        .then((res) => console.log("service worker registered"))
        .catch((err) => console.log("service worker not registered", err));
    });
  }

  map = await getJSON();
  addEventListeners();
}

//fetch spisu pieśni json
async function getJSON() {
  brzask = await fetch(`./generate json/brzask.json`).then((response) => {
    return response.json();
  });
  cegielki = await fetch(`./generate json/cegielki.json`).then((response) => {
    return response.json();
  });
  nowe = await fetch(`./generate json/nowe.json`).then((response) => {
    return response.json();
  });

  let map = new Map();
  map.set("brzask", brzask);
  map.set("cegielki", cegielki);
  map.set("nowe", nowe);
  return map;
}

//dodawnie wszytskich eventListenerów
function addEventListeners() {
  let hymnBook = document.querySelector("#hymnBook");
  let searchBox = document.querySelector("#searchBox");
  let searchResults = document.querySelector("#searchResults");

  hymnBook.addEventListener("change", changeHymnBook);
  searchBox.addEventListener("keyup", search);
}

//na zmiane śpiewnika chowa wyniki wyszukiwania, tekst i pokazuje wskazówki
function changeHymnBook(e) {
  searchBox.value = "";
  searchResults.innerHTML = "";
  searchResults.style.display = "none";

  document.querySelector("#title").innerHTML = "";
  document.querySelector("#guide").style.display = "block";
  document.querySelector("#lyrics").innerHTML = "";

  e.preventDefault();
}

//szukanie
function search(e) {
  searchResults.innerHTML = "";
  searchResults.style.display = "block";
  list = map.get(hymnBook.value);
  list.forEach((hymn, index) => {
    if (textFormat(hymn.title).search(textFormat(e.target.value)) != -1) {
      console.log(hymn.link);
      let div = document.createElement("div");
      div.setAttribute("id", index);
      div.style.margin = "1rem";
      div.innerHTML = `${hymn.title}<hr>`;
      searchResults.appendChild(div);

      //dodawanie eventlistenera do wyświetlania pieśni
      div.addEventListener("click", selectHymn);
    }
  });

  if (searchResults.hasChildNodes()) searchResults.lastChild.lastChild.remove();

  if (e.target.value == "") {
    searchResults.innerHTML = "";
    searchResults.style.display = "none";
  }

  e.preventDefault();
}

//wyświetlanie pieśni
async function selectHymn(e) {
  const parser = new DOMParser();
  let title = document.querySelector("#title");
  let lyrics = document.querySelector("#lyrics");
  let index = e.target.getAttribute("id");

  searchBox.value = "";
  searchResults.innerHTML = "";
  searchResults.style.display = "none";
  title.innerHTML = "";
  lyrics.innerHTML = "";
  document.querySelector(".loader").style.display = "block";
  document.querySelector("#guide").style.display = "none";

  let xml = await fetch(list[index].link)
    .then((res) => res.text())
    .then((xml) => parser.parseFromString(xml, "text/xml"))
    .catch((err) => console.error(err));

  document.querySelector(".loader").style.display = "none";
  title.innerHTML = xml.querySelector("title").innerHTML;
  lyrics.innerHTML = lyricsFormat(xml.querySelector("lyrics").innerHTML);

  e.preventDefault();
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
    .toLowerCase();
}

//oczyszczenie tekstu z tagów z xml
function lyricsFormat(lyrics) {
  return lyrics
    .replace(/\s*(\[V\d*\]|\[C\d*\])\s*/, "")
    .replace(/\s*(\[V\d*\]|\[C\d*\])\s*/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}

init();
