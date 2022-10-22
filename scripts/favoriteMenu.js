import { search } from "/scripts/main.js";

function menuHTML() {
  document.querySelector(".menu").innerHTML = `
    <div class="menuContent">
      <div>
        <p>Lista ulubionych</p>
        <div id="favoriteList" class="favoriteList"></div>
      </div>
      <!-- <div class="menuButtons no_select">
        <button id="cancelButton">Wyczyść listę</button>
      </div> -->
    </div>

    <div class="credits">
      <hr />
      <h3>
        Autorzy&nbsp;strony:<a href="https://github.com/Krist0f0l0s">Krzysztof&nbsp;Olszewski</a> i<a href="https://github.com/Quanosek">&nbsp;Jakub&nbsp;Kłało</a>
      </h3>
      <p>
        Wszelkie prawa zastrzeżone ©&nbsp;2022 | domena&nbsp;<a href="https://www.klalo.pl" target="_blank">klalo.pl</a>
      </p>
    </div>
  `;
}

export default () => {
  menuHTML();
  favList();
};

// posortowana lista ulubionych
export function favList() {
  favoriteList.innerHTML = "";

  let data = JSON.parse(localStorage.getItem("favorite"));
  data = data.sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
  for (let i = 0; i < data.length; i++) search(data[i]);

  // usuwanie ostatniego <hr> w wyszukiwarce
  if (favoriteList.hasChildNodes()) favoriteList.lastChild.remove();

  // brak zapisach pieśni
  if (favoriteList.innerHTML == "") {
    const div = document.createElement("div");
    div.setAttribute("class", "favoriteNoResults");
    div.innerHTML = `Wyszukaj swoją ulubioną pieśń i kliknij w ikonkę gwiazdki!`;
    favoriteList.appendChild(div);
  }
}
