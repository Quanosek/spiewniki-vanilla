import { globalShortcuts } from "/scripts/main.js";

let hymn;
let slideNumber = -1;

// parametry wybranej pieśni
export function hymnParam(param) {
  hymn = param;
}

// wszystkie eventy pokazu slajdów
export function slideEvents() {
  // nawigacja między slajdami
  const navigationEvents = ["wheel", "keyup"];
  navigationEvents.forEach((event) => {
    document.addEventListener(event, (e) => {
      if (document.fullscreenElement)
        slideNumber = SlidesControls(e, slideNumber);
    });
  });

  // gesty dotykowe ekranu
  let startPosition;
  document.addEventListener("touchstart", (e) => {
    if (document.fullscreenElement) startPosition = e.touches[0].clientX;
  });
  document.addEventListener("touchend", (e) => {
    document.getElementById("slideHandler").style.backgroundColor = "";
    document.getElementById("PGbar").style.display = "flex";
    document.getElementById("PGfulfill").style.width = "";

    if (document.fullscreenElement) {
      const endPosition = e.changedTouches[0].clientX - startPosition;
      if (endPosition < 0) slideNumber = prevSlide(slideNumber);
      else slideNumber = nextSlide(slideNumber);
    }
  });

  // zmiana pełnego ekranu
  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
      document.getElementById("slideHandler").style.backgroundColor = "";
      document.getElementById("PGbar").style.display = "flex";
      document.getElementById("PGfulfill").style.width = "0%";

      document.removeEventListener("keyup", globalShortcuts);
      document.addEventListener("mousemove", handleMouseMove);
      document.getElementById("sTitle").innerHTML = hymn.title;
      printVerse((slideNumber = -1));
    } else {
      document.addEventListener("keyup", globalShortcuts);
      document.removeEventListener("mousemove", handleMouseMove);
    }
  });
}

// sterowanie pokazem slajdów (komputer)
function SlidesControls(e, slideNumber) {
  document.getElementById("slideHandler").style.backgroundColor = "";
  document.getElementById("PGbar").style.display = "flex";
  document.getElementById("PGfulfill").style.width = "";

  // strzałki w lewo i w górę, oraz scroll w górę
  if ([37, 38].includes(e.keyCode) || e.deltaY < 0)
    slideNumber = prevSlide(slideNumber);

  // spacja, strzałki w prawo i w dół, oraz scroll w dół
  if ([32, 39, 40].includes(e.keyCode) || e.deltaY > 0)
    slideNumber = nextSlide(slideNumber);

  return slideNumber;
}

// poprzedni slajd
function prevSlide(slideNumber) {
  let fulfill = 0;

  if (slideNumber >= 0) {
    slideNumber--;
    if (hymn.presentation) {
      fulfill = (100 / hymn.presentation.length) * (slideNumber + 1);
      printVerse(hymn.presentation[slideNumber]);
      if (slideNumber === -1)
        document.getElementById("sTitle").innerHTML = hymn.title;
    } else {
      fulfill = (100 / hymn.verses.length) * (slideNumber + 1);
      printVerse(slideNumber);
    }
  }

  document.getElementById("PGfulfill").style.width = `${fulfill}%`;
  return slideNumber;
}

// następny slajd
function nextSlide(slideNumber) {
  let fulfill = 0;

  if (hymn.presentation) {
    if (slideNumber < hymn.presentation.length + 1) {
      slideNumber++;
      fulfill = (100 / hymn.presentation.length) * (slideNumber + 1);
      printVerse(hymn.presentation[slideNumber]);
      lastSlides(slideNumber, hymn.presentation.length);
    }
  } else {
    if (slideNumber < hymn.verses.length + 1) {
      slideNumber++;
      fulfill = (100 / hymn.verses.length) * (slideNumber + 1);
      printVerse(slideNumber);
      lastSlides(slideNumber, hymn.verses.length);
    }
  }

  document.getElementById("PGfulfill").style.width = `${fulfill}%`;
  return slideNumber;
}

// inne zachowanie 2 ostatnich slajdów
function lastSlides(slideNumber, param) {
  if (slideNumber >= param) {
    document.getElementById("PGbar").style.display = "none";
    document.getElementById("PGfulfill").style.width = "";
    document.getElementById("slideHandler").style.backgroundColor = "#000000";
  }
  if (slideNumber === param + 1) {
    document.exitFullscreen();
  }
}

// szukanie wersów tekstu pieśni
function printVerse(verseNumber) {
  const sTitle = document.getElementById("sTitle");
  const sAuthor = document.getElementById("sAuthor");
  const sVerse = document.getElementById("sVerse");

  const verse = hymn.getVerse(verseNumber);
  if (verse) {
    sTitle.classList.add("top");
    sTitle.innerHTML = hymn.title;
    sAuthor.innerHTML = hymn.author;
    sVerse.innerHTML = "";

    verse.forEach((line) => {
      const text = document.createElement("p");
      if (!line.startsWith(".")) {
        if (line.startsWith(" ")) line = line.slice(1);
        text.innerHTML = line;
        sVerse.appendChild(text);
      }
    });
  } else {
    sTitle.classList.remove("top");
    sAuthor.innerHTML = "";
    sVerse.innerHTML = "";
    if (verseNumber !== -1) sTitle.innerHTML = "";
  }
}

// poruszanie myszką przy pokazie slajdów
let idleTimer = null;
let idleState = false;
const slidesStyle = document.querySelector(".slides").style;

function handleMouseMove() {
  clearTimeout(idleTimer);
  if (idleState == true) slidesStyle.cursor = "default";
  idleState = false;
  idleTimer = setTimeout(() => {
    slidesStyle.cursor = "none";
    idleState = true;
  }, 2000);
}
