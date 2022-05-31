from time import sleep
from bs4 import BeautifulSoup
import requests
import sys
# We will try to pass the link to the database
def stringConvert(str):
    ans = ''
    for i in str:
        if (i >= '0' and i <= '9'):
            ans += i 
    ans = int(ans)
    return ans

def scrape():
    url = sys.argv[1]
    r = requests.get(url)
    htmlContent = r.content
    soup = BeautifulSoup(htmlContent,'html.parser')
    price = soup.select("._30jeq3._16Jk6d")
    desc = soup.select(".B_NuCI")
    p = price[0].get_text()
    p = stringConvert(p)
    q = desc[0].get_text()
    photourl = soup.select("._396cs4._2amPTt._3qGmMb._3exPp9")
    print(p)
    print(photourl[0]['src'])
    print(q)
    return [p,q]
m = scrape()
# while True:
#     scrape()
#     sleep(3)
# for i in sys.argv:
#     print(i)