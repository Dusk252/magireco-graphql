import urllib.request as ur
import os
import json


def main():
    url = os.environ.get('MAGIRECO_API_URL')
    s = ''
    request = ur.Request(url,
                         headers={"f4s-client-ver": "3", "USER-ID-FBA9X88MAE": os.environ.get('MAGIRECO_USER_HEADER')})

    with open("json/charaCard.json", "w", encoding="utf-8-sig") as f:
        s = ur.urlopen(request).read().decode("utf-8")
        f.write(s)

    print('original file download success')
    return json.loads(s)
