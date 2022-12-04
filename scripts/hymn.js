export default class Hymn {
  constructor(id, title, lyrics, author, presentation) {
    this.id = id;
    this.title = title;
    this.author = author;

    let separator = /\s*\[\w*\]\s*/;
    let verses = lyrics.split(separator).slice(1);
    verses.forEach((element, index) => {
      verses[index] = element.split(/\n/g).slice(0);
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
    }

    this.presentation = presentation;
  }

  getLyrics() {
    let verses = [];

    this.verses.forEach((verse) => {
      verses.push(verse);
    });

    return verses;
  }

  getVerse(index) {
    return this.verses[index];
  }
}
