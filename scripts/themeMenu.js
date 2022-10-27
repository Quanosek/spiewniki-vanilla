import { hideMenu } from "/scripts/menu.js";

function menuHTML() {
  document.querySelector(".menu").innerHTML = `
    <div id="changeTheme" class="menuContent">
      <div>
        <p>Zmień motyw kolorów</p>
        <form class="themeSelector no_select">
          <label class="black" for="black">
            <img class="invert" src="/files/icons/text.svg" />
            <input type="radio" name="theme" id="black" value="black" />
          </label>
          <label class="dark" for="dark">
            <img class="invert" src="/files/icons/text.svg" />
            <input type="radio" name="theme" id="dark" value="dark" />
          </label>
          <label class="light" for="light">
            <img src="/files/icons/text.svg" />
            <input type="radio" name="theme" id="light" value="light" />
          </label>
          <label class="reading" for="reading">
            <img src="/files/icons/text.svg" />
            <input type="radio" name="theme" id="reading" value="reading" />
          </label>
        </form>
      </div>
      <div>
        <p>Zmień wielkość tekstu</p>
        <div class="fontSlideBar no_select">
          <div id="smaller">A</div>
          <input type="range" id="fontSlideBar" min="14" max="28" step="0.5" />
          <div id="bigger">A</div>
        </div>
      </div>
      <button id="clearCache" class="menuButtons no_select">Wyczyść pamięć podręczną</button>
      <div class="menuButtons no_select">
        <button id="saveButton">Zapisz</button>
        <button id="cancelButton">Resetuj</button>
      </div>
    </div>

    <div class="credits">
      <hr />
      <h3>
        Autorzy&nbsp;strony: <a href="https://github.com/Krist0f0l0s">Krzysztof&nbsp;Olszewski</a> i<a href="https://github.com/Quanosek">&nbsp;Jakub&nbsp;Kłało</a>
      </h3>
      <p>
        Wszelkie prawa zastrzeżone ©&nbsp;2022 | domena&nbsp;<a href="https://www.klalo.pl" target="_blank">klalo.pl</a>
      </p>
    </div>
  `;
}

export default function init() {
  menuHTML();

  // wczytywanie danych z pamięci podręcznej
  const theme = localStorage.getItem("theme");
  const radios = document.querySelectorAll('input[type="radio"][name="theme"]');
  const fontSlideBar = document.getElementById("fontSlideBar");
  const fontSize = localStorage.getItem("fontSize");

  radios.forEach((selection) => {
    if (!theme && selection.value === "black") selection.checked = "true";
    else if (theme === selection.value) selection.checked = "true";
  });
  if (!theme) document.documentElement.className = "black";
  else document.documentElement.className = theme;

  fontSlideBar.value = fontSize;
  fontSizeChange(fontSlideBar.value);

  // działanie funkcji
  eventsListener(theme, radios);
}

// dodawanie wszystkich eventListenerów
function eventsListener(theme, radios) {
  const clearCacheButton = document.getElementById("clearCache");
  const resetButton = document.getElementById("cancelButton");

  radios.forEach((selection) => {
    selection.addEventListener("change", () => {
      document.documentElement.className = selection.value;
    });
  });

  fontSlideBar.addEventListener("change", () =>
    fontSizeChange(fontSlideBar.value)
  );

  clearCacheButton.addEventListener("click", clearCache);
  saveButton.addEventListener("click", hideMenu);
  resetButton.addEventListener("click", () => resetSettings(theme, radios));
}

// suwak do zmiany wielkości czcionki
function fontSizeChange(param) {
  title.style.fontSize = parseInt(param) * 1.4 + "px";
  lyrics.style.fontSize = param * 1.1 + "px";
}

// zapytanie przeglądarki z potwierdzeniem działań wyczyszczenia cache
function clearCache() {
  const retVal = confirm("Czy na pewno chcesz wyczyścić całą stronę?");
  if (retVal == true) {
    caches.keys().then(function (names) {
      for (let name of names) caches.delete(name);
    });
    window.location.reload();
  }
}

// reset i ukrycie menu
function resetSettings(theme, radios) {
  const retVal = confirm("Czy na pewno chcesz przywrócić ustawienia domyślne?");
  if (retVal == true) {
    theme = document.documentElement.className = "black";
    radios.forEach((selection) => {
      if (theme === selection.value) selection.checked = "true";
    });

    fontSlideBar.value = "19";
    fontSizeChange(fontSlideBar.value);
    hideMenu();
  }
}

init();
