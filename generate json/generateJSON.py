from bs4 import BeautifulSoup
import json
import requests
import re

def generuj(main_url, github_url, name, regex):
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
        if(a!=-1):
            title = a['title']
            href = a['href']
            pos = href.rfind('/')
            href = href[pos:]
            pos = regex.search(title).start()

            if(href[pos+1]=="a"):
                aAttribute = True
            else:
                aAttribute = False

            number = int(title[:pos])
            x = {
                "number": number,
                "title": title,
                "link": github_url+href,
                "a": aAttribute
            }
            hymns.append(x)

    def myFunc(e):
        return e['number']

    hymns = sorted(hymns, key=myFunc)
    hymns = json.dumps(hymns)
    with open(name + ".json", "w") as outfile:
        outfile.write(hymns)

main_url = "https://github.com/Quanosek/Piesni-OpenSong/tree/main/%C5%9Apiewajcie%20Panu%20Pie%C5%9B%C5%84%20Now%C4%85%20(Kozia%C5%84skie%2C%20Pozna%C5%84skie)"
raw_url = "https://raw.githubusercontent.com/Quanosek/Piesni-OpenSong/main/%C5%9Apiewajcie%20Panu%20Pie%C5%9B%C5%84%20Now%C4%85%20(Kozia%C5%84skie%2C%20Pozna%C5%84skie)";
generuj(main_url, raw_url, "nowe", re.compile(r'([N.]|[aN.])'));

main_url = "https://github.com/Quanosek/Piesni-OpenSong/tree/main/Pie%C5%9Bni%20Brzasku%20Tysi%C4%85clecia";
raw_url = "https://raw.githubusercontent.com/Quanosek/Piesni-OpenSong/main/Pie%C5%9Bni%20Brzasku%20Tysi%C4%85clecia";
generuj(main_url, raw_url, "brzask", re.compile(r'([.]|[a.])'));

main_url = "https://github.com/Quanosek/Piesni-OpenSong/tree/main/Uwielbiajmy%20Pana%20(Cegie%C5%82ki)";
raw_url = "https://raw.githubusercontent.com/Quanosek/Piesni-OpenSong/main/Uwielbiajmy%20Pana%20(Cegie%C5%82ki)";
generuj(main_url, raw_url, "cegielki", re.compile(r'([C.]|[aC.])'));

print("Gotowe.")