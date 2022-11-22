import { globalShortcuts } from "/scripts/main.js";

export default (hymn) => {
  // operator kolejności slajdów
  let slideNumber = -1;

  // nawigacja między slajdami
  const navigationEvents = ["wheel", "keyup"];
  navigationEvents.forEach((event) => {
    document.addEventListener(event, (e) => {
      if (document.fullscreenElement)
        slideNumber = SlidesControls(e, slideNumber);
    });
  });

  // zmiana pełnego ekranu
  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
      document.getElementById("slideHandler").style.backgroundColor = "";
      slideNumber = touchGestures(slideNumber);

      document.removeEventListener("keyup", globalShortcuts);
      document.addEventListener("mousemove", handleMouseMove);
      document.getElementById("sTitle").innerHTML = hymn.title;
      printVerse((slideNumber = -1));
    } else {
      document.addEventListener("keyup", globalShortcuts);
      document.removeEventListener("mousemove", handleMouseMove);
    }
  });

  // sterowanie pokazem slajdów
  function SlidesControls(e, slideNumber) {
    document.getElementById("slideHandler").style.backgroundColor = "";

    // strzałki w lewo i w górę, oraz scroll w górę
    if ([37, 38].includes(e.keyCode) || e.deltaY < 0)
      slideNumber = prevSlide(slideNumber);

    // spacja, strzałki w prawo i w dół, oraz scroll w dół
    if ([32, 39, 40].includes(e.keyCode) || e.deltaY > 0)
      slideNumber = nextSlide(slideNumber);

    return slideNumber;
  }

  // gesty dla ekranów dotykowych na pokazie slajdów
  function touchGestures(slideNumber) {
    let startPosition;

    document.addEventListener("touchstart", (e) => {
      if (document.fullscreenElement) startPosition = e.touches[0].clientX;
    });
    document.addEventListener("touchend", (e) => {
      if (document.fullscreenElement) {
        const endPosition = e.changedTouches[0].clientX - startPosition;
        if (endPosition < 0) slideNumber = prevSlide(slideNumber);
        else slideNumber = nextSlide(slideNumber);
      }
    });

    return slideNumber;
  }

  // poprzedni slajd
  function prevSlide(slideNumber) {
    if (slideNumber >= 0) {
      slideNumber--;
      if (hymn.presentation) {
        printVerse(hymn.presentation[slideNumber]);
        if (slideNumber === -1)
          document.getElementById("sTitle").innerHTML = hymn.title;
      } else printVerse(slideNumber);
    }
    return slideNumber;
  }

  // następny slajd
  function nextSlide(slideNumber) {
    if (hymn.presentation) {
      if (slideNumber < hymn.presentation.length + 1) {
        slideNumber++;
        printVerse(hymn.presentation[slideNumber]);
        lastSlides(slideNumber, hymn.presentation.length);
      }
    } else {
      if (slideNumber < hymn.verses.length + 1) {
        slideNumber++;
        printVerse(slideNumber);
        lastSlides(slideNumber, hymn.verses.length);
      }
    }
    return slideNumber;
  }

  // inne zachowanie 2 ostatnich slajdów
  function lastSlides(slideNumber, param) {
    if (slideNumber >= param)
      document.getElementById("slideHandler").style.backgroundColor = "#000000";
    if (slideNumber === param + 1) document.exitFullscreen();
  }

  // szukanie wersów tekstu pieśni
  function printVerse(verseNumber) {
    const sTitle = document.getElementById("sTitle");
    const sAuthor = document.getElementById("sAuthor");
    const sVerse = document.getElementById("sVerse");

    if (hymn.getVerse(verseNumber)) {
      sTitle.classList.add("top");
      sTitle.innerHTML = hymn.title;
      sAuthor.innerHTML = hymn.author;
      sVerse.innerHTML = hymn.getVerse(verseNumber);
    } else {
      sTitle.classList.remove("top");
      sAuthor.innerHTML = "";
      sVerse.innerHTML = "";
      if (verseNumber !== -1) sTitle.innerHTML = "";
    }
  }

  // poruszanie myszką przy pokazie slajdów
  function handleMouseMove() {
    const slidesStyle = document.querySelector(".slides").style;
    slidesStyle.cursor = "default";
    setTimeout(() => {
      slidesStyle.cursor = "none";
    }, 2000);
  }
};
