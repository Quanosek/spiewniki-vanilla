const parser = new DOMParser();

async function getJSON() {

    brzask = await fetch(`./generate json/brzask.json`)
        .then(response => {
            return response.json();
        });
    cegielki = await fetch(`./generate json/cegielki.json`)
        .then(response => {
            return response.json();
        });
    nowe = await fetch(`./generate json/nowe.json`)
        .then(response => {
            return response.json();
        });

    const guide = document.querySelector("#guide").innerHTML;

    let list = brzask;

    let hymnBook = document.querySelector('#hymnBook');
    hymnBook.addEventListener('change', () => {
        if (hymnBook.value === "brzask") list = brzask
        else if (hymnBook.value === "cegielki") list = cegielki
        else if (hymnBook.value === "nowe") list = nowe

        searchBox.value = "";
        searchResults.innerHTML = "";
        searchResults.style.display = "none";
        document.querySelector("#title").innerHTML = "";
        document.querySelector("#lyrics").innerHTML = guide;
    });

    let searchBox = document.querySelector("#searchBox");
    searchBox.addEventListener("keyup", (e) => {

        let searchResults = document.querySelector("#searchResults");
        searchResults.innerHTML = "";
        searchResults.style.display = "block";

        list.forEach((hymn) => {
            if (
                textFormat(hymn.title).toLowerCase()
                .search(textFormat(e.target.value).toLowerCase()) != -1
            ) {
                div = document.createElement("div");
                div.innerHTML = `<div style="margin: 1rem">${hymn.title}</div><hr>`;
                searchResults.appendChild(div);

                div.addEventListener("click", (e) => {
                    searchBox.value = "";
                    let pos = e.target.innerHTML.indexOf(".");
                    let number = parseInt(e.target.innerHTML.substr(0, pos));

                    searchResults.innerHTML = "";
                    searchResults.style.display = "none";

                    let found;
                    if (hymn.a) found = list.find(hymn => hymn.number === number && hymn.a);
                    else found = list.find(hymn => hymn.number === number);

                    const oReq = new XMLHttpRequest();
                    oReq.addEventListener("load", reqListener);
                    oReq.open("GET", found.link);
                    oReq.send();

                    document.querySelector("#title").innerHTML = "";
                    document.querySelector("#lyrics").innerHTML = "";
                    document.querySelector(".loader").style.display = "block";
                    e.preventDefault();
                });

            };
        });

        try { searchResults.lastChild.lastChild.remove() } catch {};

        if (e.target.value == "")
            try { searchResults.innerHTML = "".style.display = "none" } catch {};

        e.preventDefault();
    });
};

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
        .replace("ń", "n")
};

// wyświetlanie pieśni w .lyrics

function reqListener() {
    let xml = parser.parseFromString(this.responseText, "text/xml");
    let title = document.querySelector("#title");
    let lyrics = document.querySelector("#lyrics");

    title.innerHTML = xml.querySelector("title").innerHTML;

    const tekst = xml.querySelector("lyrics").innerHTML
        .replace(/\s*(\[V\d*\]|\[C\d*\])\s*/, "")
        .replace(/\s*(\[V\d*\]|\[C\d*\])\s*/g, "<br/><br/>")
        .replace(/\n/g, "<br/>")

    document.querySelector(".loader").style.display = "none";
    lyrics.innerHTML = tekst;
};

getJSON();