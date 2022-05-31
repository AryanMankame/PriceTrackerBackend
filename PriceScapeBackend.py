from time import sleep
from bs4 import BeautifulSoup
import requests
import sys
def stringConvert(str):
    ans = ''
    for i in str:
        if (i >= '0' and i <= '9'):
            ans += i 
    return ans
def scrape():
    url = sys.argv[1]
    # print(url)
    r = requests.get(url)
    htmlContent = r.content
    soup = BeautifulSoup(htmlContent,'html.parser')
    # print(soup)
    price = soup.select("._30jeq3._16Jk6d")
    p = price[0].get_text()
    p = stringConvert(p);
    print(p)
scrape()