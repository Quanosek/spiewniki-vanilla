async function init() {
  // menu HTML
  window.addEventListener("load", () => {
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
          Autorzy&nbsp;strony:
          <a href="https://github.com/Krist0f0l0s"> Krzysztof&nbsp;Olszewski</a>
          i<a href="https://github.com/Quanosek">&nbsp;Jakub&nbsp;Kłało</a>
        </h3>
        <p>
          Wszelkie prawa zastrzeżone ©&nbsp;2022 | domena&nbsp;<a
            href="https://www.klalo.pl"
            target="_blank"
            >klalo.pl</a
          >
        </p>
    </footer>

    </div>
    `;

    // wczytywanie danych z pamięci podręcznej

    const theme = localStorage.getItem("theme");
    const radios = document.querySelectorAll(
      'input[type="radio"][name="theme"]'
    );
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
    EventListener();
  });
}

// dodawanie wszystkich eventListenerów
function EventListener() {
  const menuButton = document.getElementById("menuButton");
  const radios = document.querySelectorAll('input[type="radio"][name="theme"]');
  const clearCacheButton = document.getElementById("clearCache");
  const saveButton = document.getElementById("saveButton");
  const resetButton = document.getElementById("cancelButton");

  menuButton.addEventListener("click", showMenu);
  radios.forEach((selection) =>
    selection.addEventListener("change", () => changeTheme(selection))
  );
  fontSlideBar.addEventListener("change", fontSizeChange);
  clearCacheButton.addEventListener("click", clearCache);
  saveButton.addEventListener("click", saveMenu);
  resetButton.addEventListener("click", resetSettings);
}

// pokazanie menu
function showMenu() {
  const xPos = window.scrollX;
  const yPos = window.scrollY;
  window.onscroll = () => {
    window.scroll(xPos, yPos);
  };

  const menuHolder = document.getElementById("menuHolder");
  menuHolder.style.visibility = "visible";
  menuHolder.style.opacity = "1";
}

// zmiana motywu kolorów
function changeTheme(selection) {
  document.documentElement.className = selection.value;
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
function resetSettings() {
  const retVal = confirm("Czy na pewno chcesz przywrócić ustawienia domyślne?");
  if (retVal == true) {
    theme = document.documentElement.className = "black";
    const radios = document.querySelectorAll(
      'input[type="radio"][name="theme"]'
    );
    radios.forEach((selection) => {
      if (theme === selection.value) selection.checked = "true";
    });
    localStorage.removeItem("theme");

    const fontSlideBar = document.getElementById("fontSlideBar");
    fontSlideBar.value = "17";
    fontSizeChange();
    localStorage.removeItem("fontSize");

    hideMenu();
  }
}

// ukrycie menu
function hideMenu() {
  const menuHolder = document.getElementById("menuHolder");

  window.onscroll = "";
  menuHolder.style.visibility = "hidden";
  menuHolder.style.opacity = "0";
}

init();
