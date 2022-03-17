from time import sleep
from bs4 import BeautifulSoup
import requests
# We will try to pass the link to the database
def scrape():
    url = "https://www.flipkart.com/motorola-zx2-100-cm-40-inch-full-hd-led-smart-android-tv-dolby-atmos-vision/p/itm224f48c542525?pid=TVSFSK2E5JHFPHR5&lid=LSTTVSFSK2E5JHFPHR5EYGGN1&marketplace=FLIPKART&store=ckf%2Fczl&srno=b_1_1&otracker=browse&fm=Search&iid=fc5c1185-7f1c-43ef-89b9-5112b70f5e31.TVSFSK2E5JHFPHR5.SEARCH&ppt=sp&ppn=sp&ssid=otleyk7kuo0000001647349597520"
    r = requests.get(url)
    print(url)
    htmlContent = r.content
    soup = BeautifulSoup(htmlContent,'html.parser')
    # print(soup)
    price = soup.select("._30jeq3._16Jk6d")
    print(price[0].get_text())
while True:
    scrape()
    sleep(3)
