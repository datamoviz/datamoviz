import requests, re
from bs4 import BeautifulSoup
import pandas as pd
import json
import pickle

def translate_genre(genre):
    translations = dict({
        'Musical': 'Music',
        'Sci-Fi': 'Science Fiction',
    })

    not_supported = ['Biography', 'Film-Noir', 'Game-Show', 'Reality-TV']

    if genre in translations.keys():
        return translations[genre]

    if genre in not_supported:
        return None

    return genre

def translate_country(country):
    translations = dict({
        'USA': 'United States of America',
        'UK': 'United Kingdom',
    })

    if country in translations.keys():
        return translations[country]

    return country

def get_sibling(element):
    if element == None:
        return None

    return element.next_sibling.strip()

def get_attribute_value(elements, attribute):
    if len(elements) == 0:
        return None

    return elements[0][attribute]

def get_value(elements):
    if len(elements) == 0:
        return None

    return elements[0].text

def get_value_in_link(element):
    if element == None:
        return []

    value = element.parent.select('a')

    if len(value) == 0:
        return []

    return list(map(lambda e: e.text.strip(), value))

def get_popularity(popularity):
    if len(popularity) == 0:
        return None

    return re.search('\d{1,3}(,\d{3})*(\.\d+)?', popularity[0].text).group(0)

def scrap_imdb(imdbId):
    response = requests.get('http://www.imdb.com/title/{!s}/'.format(imdbId), headers={"Accept-Language": "en-US,en;q=0.5"}) # Headers are mandatory
    soup = BeautifulSoup(response.text, 'html.parser')

    movie = {}
    movie['id'] = imdbId
    genres = list(map(lambda g: translate_genre(g.text), soup.select('span[itemprop="genre"]')))
    movie['genres'] = [g for g in genres if g is not None]
    movie['date'] = get_attribute_value(soup.select('meta[itemprop="datePublished"]'), 'content')
    movie['duration'] = get_attribute_value(soup.select('time[itemprop="duration"]'), 'datetime')
    movie['imdb_rating'] = get_value(soup.select('span[itemprop="ratingValue"]'))
    movie['imdb_nb_reviews'] = get_value(soup.select('span[itemprop="ratingCount"]'))
    movie['content_rating'] = get_attribute_value(soup.select('meta[itemprop="contentRating"]'), 'content')
    movie['budget'] = get_sibling(soup.find('h4',text='Budget:'))
    movie['revenue'] = get_sibling(soup.find('h4',text='Gross:'))
    movie['color'] = get_value_in_link(soup.find('h4',text='Color:'))
    movie['languages'] = get_value_in_link(soup.find('h4',text='Language:'))
    movie['countries'] = list(map(lambda c: translate_country(c), get_value_in_link(soup.find('h4',text='Country:'))))
    movie['popularity'] = get_popularity(soup.select('.popularityTrendUp + .titleReviewBarSubItem div span.subText'))

    return movie

if __name__ == '__main__':

    # from requests_futures.sessions import FuturesSession
    # session = FuturesSession(max_workers=10)
    # futures = []
    # results =[]
    #
    # for url in urls:
    #     future = session.get(url)
    #     futures.append((url, future))

    DATA_FILENAME = './data/imdb_datas.json'
    INDEX_FILENAME = './data/imdb_ids_index.txt'

    # Load the imdb ids
    imdb_ids = json.load(open('./data/imdb_id.json'))

    # Restore start_index
    start_index = 0
    with open(INDEX_FILENAME) as f:
        for line in f:
            print(line)
            start_index = int(line)
            break

    for i in range(start_index, len(imdb_ids)):
        imdb_id = imdb_ids[i]
        print(i, "/", len(imdb_ids), " ", imdb_id)
        entry = scrap_imdb(imdb_id)

        # Save the data
        with open(DATA_FILENAME, mode='a', encoding='utf-8') as data_json:
            json_data = json.dumps(entry)
            data_json.write(json_data + ',\n')

        # Save current index
        with open(INDEX_FILENAME, 'w') as imdb_ids_index_file:
            imdb_ids_index_file.write('%d' % i)


    print(scrap_imdb('tt1655442'))
