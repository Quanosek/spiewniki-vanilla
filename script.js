let currentSong, // remember current song index number (for arrows)
  bookLength = ""; // remember current book index length (for arrows)

// główna funkcja
async function init() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("/serviceWorker.js")
        .then((res) => console.log("> Service worker: registered"))
        .catch((err) => console.log("> Service worker: not registered " + err));
    });
  }

  map = await getJSON();
  addEventListeners();
  arrows();
}

// fetch spisu pieśni json
async function getJSON() {
  brzask = await fetch(`./json/brzask.json`).then((response) => {
    return response.json();
  });
  cegielki = await fetch(`./json/cegielki.json`).then((response) => {
    return response.json();
  });
  nowe = await fetch(`./json/nowe.json`).then((response) => {
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
function addEventListeners() {
  const hymnBook = document.querySelector("#hymnBook");
  const searchBox = document.querySelector("#searchBox");
  const clearButton = document.querySelector("#clearButton");

  hymnBook.addEventListener("change", changeHymnBook);
  searchBox.addEventListener("keyup", search);
  clearButton.addEventListener("click", clearButtonFunction);
}

// chowanie wyników wyszukiwania, tekst i pokazanie wskazówek przy zmianie śpiewnika
function changeHymnBook(e) {
  currentSong = "";

  searchBox.value = "";
  searchResults.innerHTML = "";
  searchResults.style.display = "none";
  clearButton.style.display = "none";

  document.querySelector("#title").innerHTML = "";
  document.querySelector("#guide").style.display = "block";
  document.querySelector("#lyrics").innerHTML = "";
  document.querySelector(".arrows").style.display = "none";

  e.preventDefault();
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

      // dodawanie eventlistenera do wyświetlania pieśni
      div.addEventListener("click", selectHymn);
    }
  });

  if (searchResults.hasChildNodes()) searchResults.lastChild.lastChild.remove();

  if (e.target.value == "") {
    searchResults.innerHTML = "";
    searchResults.style.display = "none";
    clearButton.style.display = "none";
  }

  if (e.key === "Enter") {
    selectHymn(searchResults.firstElementChild.id);
  }

  e.preventDefault();
}

// mechanizm wyświetlania pieśni
async function selectHymn(e) {
  const parser = new DOMParser();
  let title = document.querySelector("#title");
  let lyrics = document.querySelector("#lyrics");

  let index;
  if (isNaN(e)) index = currentSong = e.target.getAttribute("id");
  else index = currentSong = e;

  searchBox.value = "";
  searchResults.innerHTML = "";
  searchResults.style.display = "none";
  clearButton.style.display = "none";

  title.innerHTML = "";
  lyrics.innerHTML = "";
  document.querySelector("#guide").style.display = "none";
  document.querySelector(".arrows").style.display = "none";
  document.querySelector(".loader").style.display = "block";

  let xml = await fetch(list[index].link)
    .then((res) => res.text())
    .then((xml) => parser.parseFromString(xml, "text/xml"))
    .catch((err) => console.error(err));

  document.querySelector(".loader").style.display = "none";
  title.innerHTML = xml.querySelector("title").innerHTML;
  lyrics.innerHTML = lyricsFormat(xml.querySelector("lyrics").innerHTML);
  document.querySelector(".arrows").style.display = "flex";

  if (isNaN(e)) e.preventDefault();
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

// oczyszczenie tekstu z tagów xml (regexy)
function lyricsFormat(lyrics) {
  return lyrics
    .replace(/\s*(\[V\d*\]|\[C\d*\])\s*/, "")
    .replace(/\s*(\[V\d*\]|\[C\d*\])\s*/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}

// strzałki boczne
function arrows() {
  const arrowLeft = document.querySelector("#arrowLeft");
  const arrowRight = document.querySelector("#arrowRight");

  arrowLeft.addEventListener("click", () => {
    if (currentSong > 0) selectHymn(parseInt(currentSong) - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  arrowRight.addEventListener("click", () => {
    if (currentSong <= bookLength - 2) selectHymn(parseInt(currentSong) + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// clearButton
function clearButtonFunction() {
  searchBox.value = "";
  searchResults.innerHTML = "";
  searchResults.style.display = "none";
  clearButton.style.display = "none";
}

init();
