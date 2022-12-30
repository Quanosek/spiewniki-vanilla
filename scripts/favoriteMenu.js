import { searchFavorite } from "/scripts/main.js";
import { hideMenu } from "/scripts/menu.js";

function menuHTML() {
  document.querySelector(".menu").innerHTML = `
    <div class="menuContent">
      <div>
        <div class="favTitle">
          <h2>Lista ulubionych</h2>
          <p id="favLength"></p>
        </div>

        <div id="favoriteList" class="favoriteList"></div>
      </div>

      <div class="menuButtons no-selection">
        <div>
          <button id="clearFavorite">Wyczyść listę</button>
          <button id="closeMenu">Zamknij</button>
        </div>
      </div>
    </div>

    <div class="credits">
      <hr />
      <h3>
        Autorzy&nbsp;strony: <a href="https://github.com/Krist0f0l0s">Krzysztof&nbsp;Olszewski</a> i<a href="https://github.com/Quanosek">&nbsp;Jakub&nbsp;Kłało</a>
      </h3>
      <p>
        Wszelkie prawa zastrzeżone ©&nbsp;2022-2023 | domena&nbsp;<a href="https://www.klalo.pl" target="_blank">klalo.pl</a>
      </p>
    </div>
  `;
}

export default () => {
  menuHTML(), favList();
  eventsListener();
};

// interaktywna lista ulubionych
export function favList() {
  favoriteList.innerHTML = "";

  // sortowanie
  let data = JSON.parse(localStorage.getItem("favorite"));
  data = data.sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

  // wyświetlanie
  let length = data.length;
  for (let i = 0; i < length; i++) searchFavorite(data[i]);

  // informacja o ilości dodanych pieśni
  let translation;
  if (length === 1) translation = "pieśń";
  else translation = "pieśni";

  let paragraph = document.getElementById("favLength");
  paragraph.innerHTML = `dodano ${length} ${translation}`;

  // usuwanie ostatniego <hr> w wyszukiwarce
  if (favoriteList.hasChildNodes()) favoriteList.lastChild.remove();

  // brak zapisach pieśni
  if (favoriteList.innerHTML == "") {
    const div = document.createElement("div");
    div.setAttribute("class", "favoriteNoResults");
    div.innerHTML = `Dodaj pierwszą ulubioną pieśń!`;
    favoriteList.appendChild(div);
  }
}

function eventsListener() {
  const clear = document.getElementById("clearFavorite");
  const close = document.getElementById("closeMenu");

  clear.addEventListener("click", clearFavArray);
  close.addEventListener("click", hideMenu);
}

function clearFavArray() {
  let data = JSON.parse(localStorage.getItem("favorite"));
  if (data.length < 1) window.alert("Brak ulubionych pieśni!");
  else {
    const retVal = confirm("Czy na pewno chcesz wyczyścić listę ulubionych?");
    if (retVal == true) {
      localStorage.setItem("favorite", "[]");
      star.src = "/files/icons/star_empty.svg";
      favList();
    }
  }
}
