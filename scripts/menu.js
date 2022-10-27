import { randomHymn } from "/scripts/main.js";
import themeMenu from "/scripts/themeMenu.js";
import favoriteMenu from "/scripts/favoriteMenu.js";

async function menuHTML() {
  document.querySelector(".LSbuttons").innerHTML = `
  
  <div id="themeMenu">
    <img src="/files/icons/settings.svg" />
    | Zmień motyw
  </div>
    <div id="favoriteMenu">
      <img src="/files/icons/star_empty.svg" />
      | Ulubione
    </div>
    <div id="Slideshow" class="onHymn">
      <img src="/files/icons/monitor.svg" />
      | Pokaz slajdów
    </div>
    <!-- <div id="openPDF" class="onHymn">
      <img src="/files/icons/file.svg" />
      | Otwórz PDF
    </div>
    <div id="playSong" class="onHymn">
      <img src="/files/icons/music.svg" />
      | Odtwórz melodię
    </div>
    <div id="printText" class="onHymn">
      <img src="/files/icons/printer.svg" />
      | Wydrukuj tekst
    </div>
    <div id="shareButton" class="onHymn">
      <img src="/files/icons/link.svg" />
      | Udostępnij pieśń
    </div> -->
  `;

  document.querySelector(".mobileMenu").innerHTML = `
    <!-- <div id="shareButton" class="mobileShortcut onHymn">
      <img src="/files/icons/link.svg" />
      <p>Udostępnij</p>
    </div>
    <div id="printText" class="mobileShortcut onHymn">
      <img src="/files/icons/printer.svg" />
      <p>Drukuj</p>
    </div> -->
    <div id="themeMenu" class="mobileShortcut">
      <img src="/files/icons/settings.svg" />
      <p>Motyw</p>
    </div>
    <div id="randomButton2" class="mobileShortcut">
      <img src="/files/icons/dice.svg" />
      <p>Wylosuj</p>
    </div>
    <div id="favoriteMenu" class="mobileShortcut">
      <img src="/files/icons/star_empty.svg" />
      <p>Ulubione</p>
    </div>
    <!-- <div id="openPDF" class="mobileShortcut onHymn">
      <img src="/files/icons/file.svg" />
      <p>PDF</p>
    </div>
    <div id="playSong" class="mobileShortcut onHymn">
      <img src="/files/icons/music.svg" />
      <p>Melodia</p>
    </div> -->
  `;
}

function multipleButton(name, func) {
  const x = document.querySelectorAll(name);
  for (let i = 0; i < x.length; i++) {
    x[i].addEventListener("click", func);
  }
}

export function showMenu() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  const menuHolder = document.querySelector(".menuHolder");
  menuHolder.style.visibility = "visible";
  menuHolder.style.opacity = "1";
}

export async function menuInit() {
  await menuHTML();
  document.querySelector(".darkBackground").addEventListener("click", hideMenu);

  multipleButton("#themeMenu", () => {
    document.querySelector(".leftSide").classList.remove("active");
    themeMenu(), showMenu();
  });
  multipleButton("#favoriteMenu", () => {
    document.querySelector(".leftSide").classList.remove("active");
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

export function runSlideshow() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) elem.requestFullscreen();
  else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
  else if (elem.msRequestFullscreen) elem.msRequestFullscreen();

  // display text
  const slideHandler = document.getElementById("slideHandler");
  slideHandler.style.display = "flex";

  document.documentElement.style.overflowY = "hidden";

  const main = document.querySelector("main").style;
  main.height = "100vh";

  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
      slideHandler.style.display = "none";
      document.documentElement.style.overflowY = "scroll";
      main.height = "auto";
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
