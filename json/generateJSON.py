from bs4 import BeautifulSoup
import json
import requests
import re


def generuj(name, hymnbook):
    main_url = "https://github.com/Quanosek/Piesni-OpenSong/tree/main/" + hymnbook
    raw_url = "https://raw.githubusercontent.com/Quanosek/Piesni-OpenSong/main/" + hymnbook

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

            hymns.append({
                "book": name,
                "title": title,
                "link": raw_url+href,
            })

    def extract_num(s, p, ret=0):
        search = p.search(s)

        if search:
            return int(search.group())
        else:
            return ret
        
    hymns.sort(key=lambda s: extract_num(s["title"], re.compile(r'\d+'), float('inf')))

    hymns = json.dumps(hymns)
    with open(name + ".json", "w") as outfile:
        outfile.write(hymns)


generuj("brzask", "1.%20Pie%C5%9Bni%20Brzasku%20Tysi%C4%85clecia")
generuj("cegielki", "2.%20Uwielbiajmy%20Pana%20%28Cegie%C5%82ki%29")
generuj("nowe", "3.%20%C5%9Apiewajcie%20Panu%20Pie%C5%9B%C5%84%20Now%C4%85")
generuj("epifania", "4.%20%C5%9Apiewniczek%20M%C5%82odzie%C5%BCowy")
generuj("syloe", "5.%20Pie%C5%9Bni%20Ch%C3%B3ru%20Syloe")
generuj("inne", "6.%20R%C3%B3%C5%BCne%20pie%C5%9Bni")

print("Gotowe.")
