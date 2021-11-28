import { data } from "./data.js";
import { dictCountries } from "./countries.js";

const years = Object.keys(data);
const countries = Object.keys(dictCountries);

const statutClasses = ["null", "un", "deux", "trois", "quatre"];

const tableau = document.getElementById("tableau");

let scaleFactor = 1;
let tableauWidth = tableau.getBoundingClientRect().width + 20;

const init = () => {
  createTableau();
  window.onresize = scaleTableau;
};

window.onload = init;

const createTableau = () => {
  fillTableau();
  addNotes();
  tableau.style.display = "grid";
  fixPositionTooltips();
  tableauWidth = tableau.getBoundingClientRect().width + 20;
  scaleTableau();
};

const fillTableau = () => {
  // on crée la ligne avec toutes les années
  for (let year of years) {
    const div = document.createElement("div");
    const p = document.createElement("p");
    p.innerHTML = year;
    p.classList.add("label-year");
    if (year % 5 === 0) p.classList.add("bold");
    div.appendChild(p);
    tableau.appendChild(div);
  }

  // puis on remplit le tableau
  for (let country of countries) {
    // d'abord on remplit la colonne avec les noms de pays
    const div = document.createElement("div");
    const p = document.createElement("p");
    p.innerHTML = dictCountries[country];
    p.classList.add("label-country");
    div.appendChild(p);
    tableau.appendChild(div);

    // puis chaque case année par année
    for (let year of years) {
      const div = document.createElement("div");
      div.classList.add("case");
      div.classList.add(statutClasses[data[year][country].statut]);

      if (data[year][country].notes || data[year][country].transition) {
        if (data[year][country].transition) {
          // on gère les transitions
          div.classList.add("transition");

          const notes1 = document.createElement("div");
          notes1.classList.add("notes");
          notes1.classList.add(statutClasses[data[year][country].statut]);

          const notes2 = document.createElement("div");
          notes2.classList.add("notes");
          notes2.classList.add(statutClasses[data[year][country].statut2]);
          const p2 = document.createElement("p");
          p2.classList.add("notes2");
          p2.classList.add("transition");
          p2.innerHTML = data[year][country].notes2;

          if (data[year][country].notes) {
            const p1 = document.createElement("p");
            p1.classList.add("notes1");
            p1.classList.add("transition");
            p1.innerHTML = data[year][country].notes;
            notes2.appendChild(p1);
          }

          notes2.appendChild(p2);

          div.appendChild(notes1);
          div.appendChild(notes2);
        } else if (data[year][country].split) {
          // on gère les cases divisées en deux
          div.classList.add("split");

          const notes1 = document.createElement("div");
          notes1.classList.add("notes");
          notes1.classList.add("split");
          notes1.classList.add(statutClasses[data[year][country].statut]);
          const p1 = document.createElement("p");
          p1.classList.add("notes1");
          p1.innerHTML = data[year][country].notes;

          const notes2 = document.createElement("div");
          notes2.classList.add("notes");
          notes2.classList.add("split");
          notes2.classList.add(statutClasses[data[year][country].statut2]);
          const p2 = document.createElement("p");
          p2.classList.add("notes2");
          p2.innerHTML = data[year][country].notes2;

          notes2.appendChild(p1);
          notes2.appendChild(p2);

          div.appendChild(notes1);
          div.appendChild(notes2);
        } else {
          // et les notes simples
          const notes = document.createElement("div");
          notes.classList.add("notes");
          const p = document.createElement("p");
          p.innerHTML = data[year][country].notes;
          notes.appendChild(p);
          div.appendChild(notes);
        }
      }
      tableau.appendChild(div);
    }
  }
};

const addNotes = () => {
  // on ajoute la note et les crédits
  // (pas dans le html pour pouvoir les ranger à la fin du tableau et les aligner)
  const footnotes = document.createElement("div");
  footnotes.classList.add("footnotes");
  const footnotesTexte = document.createElement("p");
  footnotesTexte.innerHTML =
    "1. Soutenu par un parti se revendiquant de l’écologie ou personnalité se présentant <br>comme écologiste, à l’exclusion d’anciens écologistes ayant rejoint un autre parti.";
  footnotes.appendChild(footnotesTexte);
  tableau.appendChild(footnotes);

  const credits = document.createElement("div");
  credits.classList.add("credits");
  const creditsTexte = document.createElement("p");
  creditsTexte.innerHTML =
    "Données <i>Le Monde diplomatique</i> (Philippe Descamps, Jeanne Le Bihan).";
  credits.appendChild(creditsTexte);
  tableau.appendChild(credits);
};

const fixPositionTooltips = () => {
  // on replace les tooltips qui dépassent
  Array.from(document.querySelectorAll(".notes p")).forEach((el) => {
    const transition = el.classList.contains("transition");

    let translateX = transition ? "1.6em" : "2.6em";
    let translateY = "-0.6em";

    if (
      el.getBoundingClientRect().right >
      tableau.getBoundingClientRect().right - 20
    ) {
      translateX = transition ? "-106.5%" : "-102.5%";
    }
    if (
      el.getBoundingClientRect().bottom > tableau.getBoundingClientRect().bottom
    ) {
      translateY = "calc(-100% + 1.6em)";
    }
    el.style.transform = `translate(${translateX}, ${translateY})`;
  });
};

const scaleTableau = () => {
  if (tableauWidth > window.innerWidth || scaleFactor != 1) {
    const ratio = window.innerWidth / tableauWidth;
    scaleFactor = Math.min(ratio, 1);
    tableau.style.transform = `scale(${scaleFactor})`;
  }
};
