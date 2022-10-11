async function menuHTML() {
  document.getElementById("menuHolder").innerHTML = `
    <div id="menu">

      <div class="menuContent">
        <div>
          <p>Zmień motyw kolorów</p>
            <form id="themeSelector" class="no_select">
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
          <div id="fontSlideBar_holder" class="no_select">
            <div id="smallerA">A</div>
            <input type="range" id="fontSlideBar" min="10" max="24" step="0.5" />
            <div id="biggerA">A</div>
          </div> 
        </div>
        <button id="clearCache" class="no_select">Wyczyść pamięć podręczną</button>
        <div class="menuButtons no_select">
          <button id="saveButton">Zapisz</button>
          <button id="cancelButton">Resetuj</button>  
        </div>
      </div>

      <footer>
        <hr>
        <h3>
          Autorzy&nbsp;strony:<a href="https://github.com/Krist0f0l0s"> Krzysztof&nbsp;Olszewski</a>i<a href="https://github.com/Quanosek">&nbsp;Jakub&nbsp;Kłało</a>
        </h3>
        <p>
          Wszelkie prawa zastrzeżone ©&nbsp;2022 | domena&nbsp;<a href="https://www.klalo.pl" target="_blank">klalo.pl</a>
        </p>
      </footer>

    </div>
  `;
}

(async () => {
  await menuHTML();

  // wczytywanie danych z pamięci podręcznej

  const theme = localStorage.getItem("theme");
  const radios = document.querySelectorAll('input[type="radio"][name="theme"]');
  const fontSlideBar = document.getElementById("fontSlideBar");
  const fontSize = localStorage.getItem("fontSize");

  const title = document.getElementById("title");
  const guideHeader = document.getElementById("guideHeader");
  const lyrics = document.getElementById("lyrics");
  const guideList = document.getElementById("guideList");

  radios.forEach((selection) => {
    if (!theme && selection.value === "black") selection.checked = "true";
    else if (theme === selection.value) selection.checked = "true";
  });
  if (!theme) document.documentElement.className = "black";
  else document.documentElement.className = theme;

  fontSlideBar.value = fontSize;
  title.style.fontSize = guideHeader.style.fontSize =
    parseInt(fontSize) * 1.4 + "px";
  lyrics.style.fontSize = guideList.style.fontSize = fontSize + "px";

  // działanie funkcji
  eventsListener(theme, radios);
})();

// dodawanie wszystkich eventListenerów
function eventsListener(theme, radios) {
  const clearCacheButton = document.getElementById("clearCache");
  const resetButton = document.getElementById("cancelButton");

  radios.forEach((selection) => {
    selection.addEventListener(
      "change",
      () => (document.documentElement.className = selection.value)
    );
  });
  fontSlideBar.addEventListener("change", fontSizeChange);
  menuButton.addEventListener("click", showMenu);
  saveButton.addEventListener("click", saveMenu);

  clearCacheButton.addEventListener("click", clearCache);
  resetButton.addEventListener("click", () => resetSettings(theme, radios));
}

// pokazanie menu
export function showMenu() {
  window.onscroll = () => window.scroll(0, 0);

  menuHolder.style.visibility = "visible";
  menuHolder.style.opacity = "1";
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

// suwak do zmiany wielkości czcionki
function fontSizeChange() {
  title.style.fontSize = guideHeader.style.fontSize =
    parseInt(fontSlideBar.value) * 1.4 + "px";
  lyrics.style.fontSize = guideList.style.fontSize = fontSlideBar.value + "px";
}

// zapisanie i ukrycie menu
function saveMenu() {
  localStorage.setItem("theme", document.documentElement.className);
  localStorage.setItem("fontSize", fontSlideBar.value);
  hideMenu();
}

// reset i ukrycie menu
function resetSettings(theme, radios) {
  const retVal = confirm("Czy na pewno chcesz przywrócić ustawienia domyślne?");
  if (retVal == true) {
    theme = document.documentElement.className = "black";
    radios.forEach((selection) => {
      if (theme === selection.value) selection.checked = "true";
    });

    fontSlideBar.value = "17";
    fontSizeChange();
    localStorage.removeItem("theme");
    localStorage.removeItem("fontSize");
    hideMenu();
  }
}

// ukrycie menu
export function hideMenu() {
  window.onscroll = "";
  menuHolder.style.visibility = "hidden";
  menuHolder.style.opacity = "0";
}
