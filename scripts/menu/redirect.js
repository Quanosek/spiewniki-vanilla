import { hideMenu } from "../menu.js";

export default function Redirect() {
  document.querySelector(".menu").innerHTML = `
      <div class="redirect menuContent">
        <div class="redirectTitle">
          <h2>Przejdź na nową wersję!</h2>

          <p>
            Przedstawiamy zupełnie nową aplikację <b>Śpiewniki</b> z&nbsp;odświeżoną szatą graficzną,
            przebudowanym systemem nawigacji i&nbsp;nowym wyszukiwaniem (po&nbsp;treści pieśni).
            <a href="https://spiewniki.nastrazy.org/">Kliknij&nbsp;tutaj.</a>
          </p>
        </div>

        <a class="redirectLink" href="https://spiewniki.nastrazy.org/">
          <img src="/files/images/spiewniki.webp" draggable="false" />
        </a>

        <p class="snipped">
          Sprawdź&nbsp;również&nbsp;pełną&nbsp;wersję&nbsp;na:
          <a href="https://spiewniki.klalo.pl/">spiewniki.klalo.pl</a>
        </p>

        <div class="menuButtons no-selection">
          <button id="closeMenu">Zamknij</button>
        </div>
      </div>
    `;

  const close = document.getElementById("closeMenu");
  close.addEventListener("click", hideMenu);
}
