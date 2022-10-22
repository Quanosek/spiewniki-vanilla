import { hideMenu } from "/scripts/menu.js";

function menuHTML() {
  document.querySelector(".menu").innerHTML = `
    <div id="FavoriteList" class="menuContent">
      <div>
        <p>Lista ulubionych</p>
      </div>
      <div class="menuButtons no_select">
        <button id="cancelButton">Wyczyść listę</button>
      </div>
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
};
