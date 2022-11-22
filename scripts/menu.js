import { randomHymn } from "/scripts/main.js";
import themeMenu from "/scripts/themeMenu.js";
import favoriteMenu from "/scripts/favoriteMenu.js";

async function menuHTML() {
  document.querySelector(".LSbuttons").innerHTML = `
    <div id="themeMenu" title="Kliknij, lub użyj klawisza S">
      <img alt="koło zębate" src="/files/icons/settings.svg" draggable="false" />
      | Ustawienia
    </div>
    <div id="favoriteMenu" title="Kliknij, lub użyj klawisza F">
      <img alt="gwizdka" src="/files/icons/star_empty.svg" draggable="false" />
      | Ulubione
    </div>
    <div id="Slideshow" class="onHymn" title="Kliknij, lub użyj klawisza P">
      <img alt="monitor" src="/files/icons/monitor.svg" draggable="false" />
      | Pokaz slajdów
    </div>
    <!-- <div id="openPDF" class="onHymn" title="Kliknij, lub użyj klawisza N">
      <img alt="plik" src="/files/icons/file.svg" draggable="false" />
      | Otwórz PDF
    </div>
    <div id="playSong" class="onHymn" title="Kliknij, lub użyj klawisza M">
      <img alt="nuty" src="/files/icons/music.svg" draggable="false" />
      | Odtwórz melodię
    </div>
    <div id="printText" class="onHymn">
      <img alt="drukarka" src="/files/icons/printer.svg" draggable="false" />
      | Wydrukuj tekst
    </div>
    <div id="shareButton" class="onHymn">
      <img alt="link" src="/files/icons/link.svg" draggable="false" />
      | Udostępnij pieśń
    </div> -->
  `;

  document.querySelector(".mobileMenu").innerHTML = `
    <!-- <div id="shareButton" class="mobileShortcut onHymn">
      <img alt="link" src="/files/icons/link.svg" draggable="false" />
      <p>Udostępnij</p>
    </div>
    <div id="printText" class="mobileShortcut onHymn">
      <img alt="drukarka" src="/files/icons/printer.svg" draggable="false" />
      <p>Drukuj</p>
    </div> -->
    <div id="themeMenu" class="mobileShortcut" title="Kliknij, lub użyj klawisza S">
      <img alt="koło zębate" src="/files/icons/settings.svg" draggable="false" />
      <p>Ustawienia</p>
    </div>
    <div id="randomButton2" class="mobileShortcut" title="Kliknij, lub użyj klawisza R">
      <img alt="kotka do gry" src="/files/icons/dice.svg" draggable="false" />
      <p>Wylosuj</p>
    </div>
    <div id="favoriteMenu" class="mobileShortcut" title="Kliknij, lub użyj klawisza F">
      <img alt="gwiazdka" src="/files/icons/star_empty.svg" draggable="false" />
      <p>Ulubione</p>
    </div>
    <!-- <div id="openPDF" class="mobileShortcut onHymn" title="Kliknij, lub użyj klawisza N">
      <img alt="plik" src="/files/icons/file.svg" draggable="false" />
      <p>PDF</p>
    </div>
    <div id="playSong" class="mobileShortcut onHymn" title="Kliknij, lub użyj klawisza M">
      <img alt="nuty" src="/files/icons/music.svg" draggable="false" />
      <p>Melodia</p>
    </div> -->
  `;
}

// czytanie wielu elementów z tą samą klasą
function multipleButton(name, func) {
  const x = document.querySelectorAll(name);
  for (let i = 0; i < x.length; i++) {
    x[i].addEventListener("click", func);
  }
}

// pokazanie menu
export function showMenu() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  const menuHolder = document.querySelector(".menuHolder");
  menuHolder.style.visibility = "visible";
  menuHolder.style.opacity = "1";
}

// główna funkcja
export async function menuInit() {
  await menuHTML();
  document.querySelector(".darkBackground").addEventListener("click", hideMenu);

  multipleButton("#themeMenu", () => {
    themeMenu(), showMenu();
  });
  multipleButton("#favoriteMenu", () => {
    favoriteMenu(), showMenu();
  });

  // multipleButton("#openPDF", openPDF);
  // multipleButton("#playSong", playSong);
  // multipleButton("#printText", printText);
  // multipleButton("#shareButton", shareButton);

  const SlideShow = document.getElementById("Slideshow");
  SlideShow.addEventListener("click", runSlideshow);

  const randomButton2 = document.getElementById("randomButton2");
  randomButton2.addEventListener("click", randomHymn);
}

// uruchomienie prezentacji
export function runSlideshow() {
  document.querySelector(".leftSide").classList.remove("active");

  const elem = document.documentElement;
  if (elem.requestFullscreen) elem.requestFullscreen();
  else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
  else if (elem.msRequestFullscreen) elem.msRequestFullscreen();

  // włączenie prezentacji
  const slideHandler = document.getElementById("slideHandler");
  slideHandler.style.display = "flex";
  document.documentElement.style.overflowY = "hidden";
  document.querySelector("main").style.height = "100vh";

  // ukryciE prezentacji
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
      slideHandler.style.display = "";
      document.documentElement.style.overflowY = "";
      document.querySelector("main").style.height = "";
    }
  });
}

// function openPDF() {
//   console.log("openPDF");
// }

// function playSong() {
//   console.log("playSong");
// }

// function printText() {
//   console.log("printText");
// }

// function shareButton() {
//   console.log("shareButton");
// }

// ukrycie menu
export function hideMenu() {
  const menuHolder = document.querySelector(".menuHolder");
  menuHolder.style.visibility = "hidden";
  menuHolder.style.opacity = "0";

  const myElement = document.querySelector(".menu");
  for (const child of myElement.children) {
    if (child.id === "changeTheme") {
      localStorage.setItem("theme", document.documentElement.className);
      localStorage.setItem("fontSize", fontSlideBar.value);
    }
  }
}
