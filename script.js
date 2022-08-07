const parser = new DOMParser();

async function getJSON(hymnBook) {
    let list = await fetch(`./generate json/${hymnBook}.json`)
        .then(response => {
            return response.json();
        });

    let searchBox = document.querySelector("#searchBox");

    searchBox.addEventListener("keyup", (e) => {
        let searchResults = document.querySelector("#searchResults");
        searchResults.innerHTML = "";
        searchResults.style.display = "block";

        list.forEach((hymn) => {
            if (polishReplace(hymn.title).toLowerCase().search(polishReplace(e.target.value).toLowerCase()) != -1) {
                div = document.createElement("div");
                div.innerHTML = `<div style="margin:1rem">${hymn.title}</div><hr>`;
                searchResults.appendChild(div);

                div.addEventListener("click", (e) => {
                    searchBox.value = '';
                    let pos = e.target.innerHTML.indexOf(".");
                    let number = parseInt(e.target.innerHTML.substr(0, pos));

                    searchResults.innerHTML = "";
                    searchResults.style.display = "none";
                    let link = list[number - 1].link;

                    const oReq = new XMLHttpRequest();
                    oReq.addEventListener("load", reqListener);
                    oReq.open("GET", link);
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

function polishReplace(napis) {
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
    let title = document.querySelector('#title');
    let lyrics = document.querySelector('#lyrics');

    title.innerHTML = xml.querySelector("title").innerHTML;

    const tekst = xml.querySelector("lyrics").innerHTML
        .replace(/\s*(\[V\d*\]|\[C\d*\])\s*/, '')
        .replace(/\s*(\[V\d*\]|\[C\d*\])\s*/g, '<br/><br/>')
        .replace(/\n/g, '<br/>')

    document.querySelector(".loader").style.display = "none";
    lyrics.innerHTML = tekst;
};

getJSON("hymns");

// getJSON("brzask");
// getJSON("cegielki");
// getJSON("nowe");