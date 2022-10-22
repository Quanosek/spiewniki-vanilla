import { randomHymn } from "/scripts/main.js";
import themeMenu from "/scripts/themeMenu.js";
import favoriteMenu from "/scripts/favoriteMenu.js";

async function menuHTML() {
  document.querySelector(".LSbuttons").innerHTML = `
    <div id="themeMenu">⚙️ | Zmień motyw</div>
    <div id="favoriteMenu">⭐ | Ulubione</div>
    <!-- <div id="Slideshow">🖥️ | Pokaz slajdów</div>
    <div id="openPDF">📄 | Otwórz PDF</div>
    <div id="playSong">🎶 | Odtwórz melodię</div>
    <div id="printText">🖨️ | Wydrukuj tekst</div>
    <div id="shareButton">🌐 | Udostępnij pieśń</div> -->
  `;

  document.querySelector(".mobileMenu").innerHTML = `
    <div id="themeMenu" class="mobileShortcut">
      <p class="menuIcon">⚙️</p>
      <p>Motyw</p>
    </div>
    <div id="randomButton2" class="mobileShortcut">
      <p class="menuIcon">🎲</p>
      <p>Wylosuj pieśń</p>
    </div>
    <div id="favoriteMenu" class="mobileShortcut">
      <p class="menuIcon">⭐</p>
      <p>Ulubione</p>
    </div>
    <!-- <div id="shareButton" class="mobileShortcut">
      <p class="menuIcon">🌐</p>
      <p>Udostępnij</p>
    </div>
    <div id="playSong" class="mobileShortcut">
      <p class="menuIcon">🎶</p>
      <p>Melodia</p>
    </div>
    <div id="openPDF" class="mobileShortcut">
      <p class="menuIcon">📄</p>
      <p>Otwórz PDF</p>
    </div>
    <div id="printText" class="mobileShortcut">
      <p class="menuIcon">🖨️</p>
      <p>Drukuj</p>
    </div> -->
  `;
}

function multipleButton(name, func) {
  const x = document.querySelectorAll(name);
  for (let i = 0; i < x.length; i++) {
    x[i].addEventListener("click", func);
  }
}

function showMenu() {
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

  // const SlideShow = document.getElementById("Slideshow");
  // SlideShow.addEventListener("click", runSlideshow);
  const randomButton2 = document.getElementById("randomButton2");
  randomButton2.addEventListener("click", randomHymn);
}

// function runSlideshow() {
//   const elem = document.documentElement;
//   if (elem.requestFullscreen) {
//     elem.requestFullscreen();
//   } else if (elem.webkitRequestFullscreen) {
//     elem.webkitRequestFullscreen();
//   } else if (elem.msRequestFullscreen) {
//     elem.msRequestFullscreen();
//   }
// }

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
