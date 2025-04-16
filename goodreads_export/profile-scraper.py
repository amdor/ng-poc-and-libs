import csv
import argparse
from datetime import datetime
import re

import requests
from bs4 import BeautifulSoup

BOOK_ID_KEY = 'Book Id'
DATE_ADDED_KEY = 'Date Added'
MY_RATING_KEY = 'My Rating'
COOKIE = """ccsid=168-3856520-1653657; locale=en; __qca=P0-1768272854-1716632084681; lc-main=en_US; ubid-main=135-3875371-4096051; csm-sid=615-1685178-6761303; __eoi=ID=d990497f07cc7cc1:T=1716794420:RT=1716794420:S=AA-AfjZuBLv2TKjwbmHAKkvC4iYG; allow_behavioral_targeting=true; blocking_sign_in_interstitial=true; likely_has_account=true; _session_id2=e153250c4d687fa4fadddd01a81e9416; session-id=147-4785982-2607129; csm-hit=tb:s-K6Q8ZCDPRRJ957QFNCBR|1716794909241&t:1716794909241; session-id-time=2347514916l; session-token="YqPW5ziBR9JKapuhnby7uMdn4Qo7Fl/8NexxWSjMNHVJikj4jA0ck/58KAOvGq6NWmYzmoupMPniyIimqSTshWxQhb2/rxyTQ6jpzFNcidBMjEfG9vHuKu33AEsJ2v7pFaHFpfKGWC+I8PsrasGgM03P+40BRJqbOnpoCtak+6I2bQHm5M8IeR8LwI2YqByTKYNjr5GqjmG/cd6FF6rm4T8F8OGrMiYGff/7K8D0K2VpbrXpD5IQxGHR3s03O+nPplIIO7olxj6NTGQUzMuMaq8G30TzAU03N8mvaXb2jeT1x/jzpG8sBbhtKFNRpglzSPDf53Lr1luQOjCxnEMD4ZQr89JMRoQ0IjY43QqK9jk="; x-main="2Hd2dhTyk?tjNUNhNwKk7LDMehnzALQiraxY7cifrqu4bjjf5Om?S9pwDdC1GLAO"; at-main=Atza|IwEBIDJgC6-IbSJ6onk5iuYlzZ5o9EEt2SKDa5PpKQUivmGCBdZseLE6KlSbpzcNzuWG9Kbps0wSmcJUAp9J3sJghiXqdF8XlysQb8oEylxc5rE74LPq0Cn8kWFnc3pVqWynRvez6JPmOlu_eSHAUzYOo_mWVbBgleMNjJYxF5379RXU6BazOrEiU9odhuhlx8gzrglPv8TA9pB_430M0tD4PsybK0qAD3YfWYZtlk-0Yw2tazMRGIoIW2PmQq3tu5Loj_U;"""
CSV_FIELDS = [BOOK_ID_KEY, 'Title', 'Author', 'Author l-f', 'Additional Authors', 'ISBN', 'ISBN13', MY_RATING_KEY, 'Average Rating', 'Publisher', 'Binding', 'Number of Pages', 'Year Published',
              'Original Publication Year', 'Date Read', DATE_ADDED_KEY, 'Bookshelves', 'Bookshelves with positions', 'Exclusive Shelf', 'My Review', 'Spoiler', 'Private Notes', 'Read Count', 'Owned Copies']


"""
The scraper/html parser module for the goodreads profiles
Usage:
	- From console: run 'python scraper_service.py profilesUrl1'
	- As a Python class: 
		* Initialize the class with a string URL
"""


class ScraperService:
    def __init__(self, profile_url=''):
        self.profile_url = profile_url

# get the first matched group
    @staticmethod
    def extract_result(search_result):
        return '' if not search_result else search_result[1]

    @staticmethod
    def search_for_regex(expression, text, start_pos=0, end_pos=-1):
        search_result = re.compile(expression).search(text, start_pos, end_pos)
        # fallback
        if not search_result and (start_pos > 0 or (start_pos == 0 and end_pos == -1)):
            return ScraperService.search_for_regex(expression, text, 0, len(text) - 1)
        return ScraperService.extract_result(search_result)

    def parse_review_list_page(self, soup: BeautifulSoup):
        parsed_data = {}

        rows = soup.select(selector='#booksBody tr.bookalike.review')
        for row in rows:
            link = row.select_one('.field.title a').attrs.get('href')
            parsed_data[link] = {'book_link': link}
            parsed_data[link][BOOK_ID_KEY] = ScraperService.search_for_regex(
                'show/(\d+)', link)

            date_added = row.select_one(
                '.field.date_added .value span').attrs.get('title')
            date_object = datetime.strptime(date_added, "%B %d, %Y")
            formatted_date_added = date_object.strftime("%Y/%m/%d")
            parsed_data[link][DATE_ADDED_KEY] = formatted_date_added

            my_rating = row.select('.field.rating .staticStar.p10')
            parsed_data[link][MY_RATING_KEY] = len(my_rating)

        return parsed_data

    def get_book_shelf_soup(self):
        """
        Gets profile data from the url the service was initialized with
        :rtype: BeautifulSoup
        :return: soup profile data
        """
        headers = {'User-Agent': 'Chrome/60.0.3112.113'}
        headers['Cookie'] = COOKIE
        response = requests.get(self.profile_url, headers=headers)
        content = str(response.content, encoding='utf-8')
        content = content.replace('\\xa0', ' ')
        profile_soup = BeautifulSoup(content, 'html5lib')
        return profile_soup


def main():
    parser = argparse.ArgumentParser(
        description='Provide profile URLs for scraping.')
    parser.add_argument('profile_url', nargs='+', metavar='URLs',
                        help='At least one profile URL is required')
    namespace = parser.parse_args()
    # profile_url = namespace.profile_url[0]
    profile_url = 'https://www.goodreads.com/review/list/5855333-regina?utf8=%E2%9C%93&shelf=read&per_page=100'
    print('scraping ' + profile_url)

    scraper = ScraperService(profile_url=profile_url)

    soup = scraper.get_book_shelf_soup()
    parsed_data = scraper.parse_review_list_page(soup)

    next = soup.select_one(
        selector='#reviewPagination .next_page').attrs.get('href')
    while (next is not None):
        scraper.profile_url = 'https://www.goodreads.com' + next
        print('scraping ' + scraper.profile_url)
        next_soup = scraper.get_book_shelf_soup()
        next_data = scraper.parse_review_list_page(next_soup)
        parsed_data.update(next_data)
        next = next_soup.select_one(
            selector='#reviewPagination .next_page').attrs.get('href')

    with open('toImport.csv', 'w', newline='') as csvfile:
        print('writing file "toImport.csv"')
        writer = csv.DictWriter(csvfile, fieldnames=CSV_FIELDS)
        writer.writeheader()
        for val in parsed_data.values():
            writer.writerow(
                {BOOK_ID_KEY: val[BOOK_ID_KEY], DATE_ADDED_KEY: val[DATE_ADDED_KEY], MY_RATING_KEY: val[MY_RATING_KEY]})


if __name__ == '__main__':
    main()
