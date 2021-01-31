import urllib.request as ur
import os
import json


def download_char():
    url = os.environ.get('MAGIRECO_API_CHAR_URL')
    s = ''
    request = ur.Request(url,
                         headers={"f4s-client-ver": "3", "USER-ID-FBA9X88MAE": os.environ.get('MAGIRECO_USER_HEADER')})

    with open("json/charaCard.json", "w", encoding="utf-8-sig") as f:
        s = ur.urlopen(request).read().decode("utf-8")
        f.write(s)

    print('original charaList file download success')
    return json.loads(s)


def download_se(charaId):
    data = json.dumps({"charaId": charaId})
    dataBytes = bytes(data.encode("utf-8"))

    request = ur.Request(url=os.environ.get('MAGIRECO_API_SE_URL'),
                         headers={
                             "f4s-client-ver": "3", "USER-ID-FBA9X88MAE": "1d302e58-76fb-4af3-a63a-2a91e087c3f9", "Content-Type": "application/json;charset=UTF-8"},
                         data=dataBytes,
                         method='POST')

    with open("jsons/charaEnhance.json", "w", encoding="utf-8-sig") as f:
        s = ur.urlopen(request).read().decode("utf-8")
        f.write(s)

    print(f'original se file for charaId = {charaId:f} download success')
    return json.loads(s)
