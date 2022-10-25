export default class Hymn {
  constructor(id, title, lyrics, presentation) {
    this.id = id;
    this.title = title;
    let separator = /\s*\[\w*\]\s*/;
    let verses = lyrics.split(separator).slice(1);
    verses.forEach((element, index) => {
      verses[index] = element.replace(/\n/g, "<br/>");
    });
    this.verses = verses;
    if (presentation) {
      presentation = presentation.split(" ");
      let uniq = [...new Set(presentation)];
      let map = new Map();
      uniq.forEach((element, index) => {
        map.set(element, index);
      });
      presentation.forEach((element, index) => {
        presentation[index] = map.get(element);
      });
      this.presentation = presentation;
    } else {
      this.presentation = presentation;
    }
  }

  getLyrics() {
    let lyrics = "";
    for (let index = 0; index < this.verses.length - 1; index++) {
      lyrics += `${this.verses[index]}<br/><br/>`;
    }
    lyrics += `${this.verses[this.verses.length - 1]}`;
    return lyrics;
  }

  getVerse(index) {
    return this.verses[index];
  }
}
