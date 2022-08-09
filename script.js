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

  addEventListeners();
}

function addEventListeners() {
  document
    .querySelector("#hymnBook")
    .addEventListener("change", changeHymnBook);

  let searchBox = document.querySelector("#searchBox");
  searchBox.addEventListener("keyup", (e) => {
    let searchResults = document.querySelector("#searchResults");
    searchResults.innerHTML = "";
    searchResults.style.display = "block";
    if (hymnBook.value === "brzask") list = brzask;
    else if (hymnBook.value === "cegielki") list = cegielki;
    else if (hymnBook.value === "nowe") list = nowe;
    list.forEach((hymn, index) => {
      if (
        textFormat(hymn.title)
          .toLowerCase()
          .search(textFormat(e.target.value).toLowerCase()) != -1
      ) {
        div = document.createElement("div");
        div.setAttribute("id", index);
        div.style.margin = "1rem";
        div.innerHTML = `${hymn.title}<hr>`;
        searchResults.appendChild(div);

        div.addEventListener("click", (e) => {
          searchBox.value = "";
          let index = e.target.getAttribute("id");

          searchResults.innerHTML = "";
          searchResults.style.display = "none";

          const oReq = new XMLHttpRequest();
          oReq.addEventListener("load", reqListener);
          oReq.open("GET", list[index].link);
          oReq.send();

          document.querySelector("#title").innerHTML = "";
          document.querySelector("#lyrics").innerHTML = "";
          document.querySelector(".loader").style.display = "block";
          document.querySelector("#guide").style.display = "none";
          e.preventDefault();
        });
      }
    });

    try {
      searchResults.lastChild.lastChild.remove();
    } catch {}

    if (e.target.value == "")
      try {
        searchResults.innerHTML = "".style.display = "none";
      } catch {}

    e.preventDefault();
  });
}

function changeHymnBook(e) {
  searchBox.value = "";
  searchResults.innerHTML = "";
  searchResults.style.display = "none";
  document.querySelector("#title").innerHTML = "";
  document.querySelector("#guide").style.display = "block";
  document.querySelector("#lyrics").innerHTML = "";
  e.preventDefault();
}

// podmienienie polskich znaków diakrytycznych

function textFormat(napis) {
  return napis
    .replace("ę", "e")
    .replace("ó", "o")
    .replace("ą", "a")
    .replace("ś", "s")
    .replace("ł", "l")
    .replace("ż", "z")
    .replace("ź", "z")
    .replace("ć", "c")
    .replace("ń", "n");
}

// wyświetlanie pieśni w .lyrics

function reqListener() {
  const parser = new DOMParser();
  let xml = parser.parseFromString(this.responseText, "text/xml");
  let title = document.querySelector("#title");
  let lyrics = document.querySelector("#lyrics");

  title.innerHTML = xml.querySelector("title").innerHTML;

  const tekst = xml
    .querySelector("lyrics")
    .innerHTML.replace(/\s*(\[V\d*\]|\[C\d*\])\s*/, "")
    .replace(/\s*(\[V\d*\]|\[C\d*\])\s*/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");

  document.querySelector(".loader").style.display = "none";
  document.querySelector("#guide").style.display = "none";
  lyrics.innerHTML = tekst;
}

getJSON();
