from ast import If
from asyncio.windows_events import NULL
from bs4 import BeautifulSoup
import json
import requests
import re


def generuj(main_url, raw_url, name, regex):
    req = requests.get(main_url)
    soup = BeautifulSoup(req.text, "html.parser")

    rows = soup.find_all(attrs={"role": "grid"})
    rows = rows[0].children
    next(rows)
    next(rows)
    next(rows)
    next(rows)

    hymns = []

    for row in rows:
        a = row.find("a")
        if (a != -1):
            title = a['title']
            href = a['href']
            pos = href.rfind('/')
            href = href[pos:]
            pos = title.find('.')

            x = {
                "title": title,
                "link": raw_url+href,
            }
            hymns.append(x)

    def myFunc(e):
        pos = regex.search(e['title']).start()
        number = int(e['title'][:pos])
        return number

    if regex:
        hymns = sorted(hymns, key=myFunc)

    hymns = json.dumps(hymns)
    with open(name + ".json", "w") as outfile:
        outfile.write(hymns)


main_url = "https://github.com/Quanosek/Piesni-OpenSong/tree/main/Pie%C5%9Bni%20Brzasku%20Tysi%C4%85clecia"
raw_url = "https://raw.githubusercontent.com/Quanosek/Piesni-OpenSong/main/Pie%C5%9Bni%20Brzasku%20Tysi%C4%85clecia"
generuj(main_url, raw_url, "brzask", re.compile(r'([.]|[a.])'))

main_url = "https://github.com/Quanosek/Piesni-OpenSong/tree/main/Uwielbiajmy%20Pana%20(Cegie%C5%82ki)"
raw_url = "https://raw.githubusercontent.com/Quanosek/Piesni-OpenSong/main/Uwielbiajmy%20Pana%20(Cegie%C5%82ki)"
generuj(main_url, raw_url, "cegielki", re.compile(r'([C.]|[aC.])'))

main_url = "https://github.com/Quanosek/Piesni-OpenSong/tree/main/%C5%9Apiewajcie%20Panu%20Pie%C5%9B%C5%84%20Now%C4%85%20(Nowe%20Pie%C5%9Bni)"
raw_url = "https://raw.githubusercontent.com/Quanosek/Piesni-OpenSong/main/%C5%9Apiewajcie%20Panu%20Pie%C5%9B%C5%84%20Now%C4%85%20(Nowe%20Pie%C5%9Bni)"
generuj(main_url, raw_url, "nowe", re.compile(r'([N.]|[aN.])'))

main_url = "https://github.com/Quanosek/Piesni-OpenSong/tree/main/%C5%9Apiewniczek%20M%C5%82odzie%C5%BCowy%20Epifanii"
raw_url = "https://raw.githubusercontent.com/Quanosek/Piesni-OpenSong/main/%C5%9Apiewniczek%20M%C5%82odzie%C5%BCowy%20Epifanii"
generuj(main_url, raw_url, "epifania", re.compile(r'([E.]|[aE.])'))

main_url = "https://github.com/Quanosek/Piesni-OpenSong/tree/main/Inne%20pie%C5%9Bni"
raw_url = "https://raw.githubusercontent.com/Quanosek/Piesni-OpenSong/main/Inne%20pie%C5%9Bni"
generuj(main_url, raw_url, "inne", NULL)

print("Gotowe.")
