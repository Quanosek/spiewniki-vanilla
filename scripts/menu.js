import { randomHymn } from "/scripts/main.js";

import Favorites from "/scripts/menu/favorites.js";
import Redirect from "/scripts/menu/redirect.js";
import Settings from "/scripts/menu/settings.js";

// główna funkcja
export function menuInit() {
  preventScroll();

  document.querySelector(".LSbuttons").innerHTML = `
    <div id="redirectMenu" title="Przejdź na nową wersję!">
      <img alt="update" src="/files/icons/update.svg" draggable="false" />
      Nowa aplikacja!
    </div>

    <div id="themeMenu" title="Kliknij, lub użyj klawisza S">
      <img alt="koło zębate" src="/files/icons/settings.svg" draggable="false" />
      Ustawienia
    </div>

    <div id="favoriteMenu" title="Kliknij, lub użyj klawisza F">
      <img alt="gwizdka" src="/files/icons/star_empty.svg" draggable="false" />
      Ulubione
    </div>

    <div id="Slideshow" class="onHymn" title="Kliknij, lub użyj klawisza P">
      <img alt="monitor" src="/files/icons/monitor.svg" draggable="false" />
      Pokaz slajdów
    </div>
  `;

  document.querySelector(".mobileMenu").innerHTML = `
    <div id="themeMenu" class="mobileShortcut">
      <img alt="koło zębate" src="/files/icons/settings.svg" draggable="false" />
      <p>Ustawienia</p>
    </div>

    <div id="randomButton2" class="mobileShortcut">
      <img alt="kotka do gry" src="/files/icons/dice.svg" draggable="false" />
      <p>Wylosuj</p>
    </div>

    <div id="favoriteMenu" class="mobileShortcut">
      <img alt="gwiazdka" src="/files/icons/star_empty.svg" draggable="false" />
      <p>Ulubione</p>
    </div>
  `;

  // schowaj menu po kliknięciu w tło
  document.querySelector(".darkBackground").addEventListener("click", hideMenu);

  // czytanie wielu elementów z tą samą klasą
  const multipleButton = (name, func) => {
    const x = document.querySelectorAll(name);
    for (let i = 0; i < x.length; i++) {
      x[i].addEventListener("click", func);
    }
  };

  multipleButton("#favoriteMenu", () => {
    Favorites(), showMenu();
  });
  multipleButton("#redirectMenu", () => {
    Redirect(), showMenu();
  });
  multipleButton("#themeMenu", () => {
    Settings(), showMenu();
  });

  const SlideShow = document.getElementById("Slideshow");
  SlideShow.addEventListener("click", runSlideshow);

  const randomButton2 = document.getElementById("randomButton2");
  randomButton2.addEventListener("click", randomHymn);
}

const preventScroll = () => {
  const TopScroll = document.documentElement.scrollTop;
  const LeftScroll = document.documentElement.scrollLeft;
  window.onscroll = () => window.scrollTo(LeftScroll, TopScroll);
};

// pokazanie menu
export function showMenu() {
  preventScroll();

  const menuHolder = document.querySelector(".menuHolder");
  menuHolder.style.visibility = "visible";
  menuHolder.style.opacity = "1";
}

// ukrycie menu
export function hideMenu() {
  window.onscroll = () => {};

  const menuHolder = document.querySelector(".menuHolder");
  menuHolder.style.visibility = "hidden";
  menuHolder.style.opacity = "0";

  const menu = document.querySelector(".menu");
  setTimeout(() => (menu.scrollTop = 0), "100");

  for (const child of menu.children)
    if (child.id === "changeTheme") {
      localStorage.setItem("theme", document.documentElement.className);
      localStorage.setItem("fontSize", fontSlideBar.value);
    }
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
