export default function bookNames(shortName) {
  let fullName = "";

  switch (shortName) {
    case "brzask":
      fullName = "Pieśni Brzasku Tysiąclecia";
      break;
    case "cegielki":
      fullName = "Uwielbiajmy Pana (Cegiełki)";
      break;
    case "nowe":
      fullName = "Śpiewajcie Panu Pieśń Nową";
      break;
    case "epifania":
      fullName = "Śpiewniczek Młodzieżowy Epifanii";
      break;
    case "syloe":
      fullName = "Pieśni Chóru Syloe";
      break;
    case "inne":
      fullName = "Różne pieśni";
      break;
  }

  return fullName;
}
