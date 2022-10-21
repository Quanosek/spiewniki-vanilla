export class Hymn {
    constructor(title, lyrics, presenatation) {
        this.title = title;
        let separator = /\s*\[\w*\]\s*/;
        let verses = lyrics.split(separator).slice(1);
        verses.forEach((element, index) => {
            verses[index] = element.replace(/\n/g, "<br/>");
        });
        this.verses = verses;
        if (presenatation) {
            presenatation = presenatation.split(' ');
            let uniq = [...new Set(presenatation)];
            let map = new Map();
            uniq.forEach((element, index) => {
                map.set(element, index)
            });
            presenatation.forEach((element, index) => {
                presenatation[index] = map.get(element);
            });
            this.presenatation = presenatation;
        } else {
            this.presenatation = presenatation;
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