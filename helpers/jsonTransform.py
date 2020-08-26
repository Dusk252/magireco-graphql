import json
import re
import os

input_path = 'json/charaCard.json'
output_path = 'json/charaCard_parsed.json'


def remove_redundant_card_props(character):
    keysToRemove = []
    chara = character['chara']
    for key in chara.keys():
        if (re.search(r'defaultCard(\.)*', key) or re.search(r'evolutionCard(\.)*', key)):
            keysToRemove.append(key)
    for key in keysToRemove:
        chara.pop(key)


def flatten_magia_gift_props(character):
    magiaDict = dict()
    keysToRemove = []
    chara = character['chara']
    for key in chara.keys():
        m = re.match(r'(\w*)MagiaGift(\d+)', key)
        if m:
            magiaDict[m.group(1)][int(m.group(2)) - 1].update(chara[key])
            keysToRemove.append(key)
            continue
        m2 = re.match(r'(\w*)MagiaGiftNum(\d+)', key)
        if m2:
            if magiaDict.keys().__contains__(m2.group(1)):
                magiaDict[m2.group(1)].append(dict([['quantity', chara[key]]]))
            else:
                magiaDict[m2.group(1)] = []
                magiaDict[m2.group(1)].append(dict([['quantity', chara[key]]]))
            keysToRemove.append(key)
            continue
        m3 = re.match(r'(\w*)MagiaGiftId(\d+)', key)
        if m3:
            keysToRemove.append(key)
    if len(magiaDict) > 0:
        chara['magiaGiftList'] = magiaDict
    for key in keysToRemove:
        chara.pop(key)
    character['chara'] = chara


def flatten_enhancement_gift_props(character):
    chara = character['chara']
    for enCell in chara['enhancementCellList']:
        keysToRemove = []
        giftArr = []
        for key in enCell:
            m = re.match(r'openGift(\d+)', key)
            if m:
                giftArr.append(enCell[key])
                keysToRemove.append(key)
                giftArr[-1]['giftNum'] = enCell['openGiftQuantity' +
                                                m.group(1)]
                keysToRemove.append('openGiftId' + m.group(1))
                keysToRemove.append('openGiftQuantity' + m.group(1))
        if len(giftArr) > 0:
            enCell['openGiftList'] = giftArr
        for key in keysToRemove:
            enCell.pop(key)


def flatten_card_gift_props(cardEl):
    card = cardEl['card']['cardCustomize']
    keysToRemove = []
    giftArr = []
    for key in card:
        m = re.match(r'gift(\d+)', key)
        if m:
            giftArr.append(dict([['gift', card[key]]]))
            keysToRemove.append(key)
            giftArr[-1]['gift']['giftNum'] = card['giftNum' + m.group(1)]
            giftArr[-1]['bonus'] = dict([['bonusCode',
                                          card['bonusCode' + m.group(1)]]])
            giftArr[-1]['bonus']['bonusNum'] = card['bonusNum' +
                                                    m.group(1)]
            keysToRemove.append('giftId' + m.group(1))
            keysToRemove.append('giftNum' + m.group(1))
            keysToRemove.append('bonusCode' + m.group(1))
            keysToRemove.append('bonusNum' + m.group(1))
    if len(giftArr) > 0:
        card['bonusList'] = giftArr
    for key in keysToRemove:
        card.pop(key)


def flatten_art_props(elWithArts):
    keysToRemove = []
    artArr = []
    for key in elWithArts:
        m = re.match(r'art(\d+)', key)
        if m:
            artArr.append(elWithArts[key])
            keysToRemove.append(key)
            keysToRemove.append('artId' + m.group(1))
    if len(artArr) > 0:
        elWithArts['arts'] = artArr
    for key in keysToRemove:
        elWithArts.pop(key)


def flatten_command_type_props(cardEl):
    card = cardEl['card']
    keysToRemove = []
    commandTypeArr = []
    for key in card:
        m = re.match(r'commandType(\d+)', key)
        if m:
            commandTypeArr.append(card[key])
            keysToRemove.append(key)
    if len(commandTypeArr) > 0:
        card['commandTypeList'] = commandTypeArr
    for key in keysToRemove:
        card.pop(key)


def process_json(data):
    for chara in data['charaList']:
        remove_redundant_card_props(chara)
        flatten_magia_gift_props(chara)
        flatten_enhancement_gift_props(chara)
        for card in chara['cardList']:
            flatten_card_gift_props(card)
            flatten_command_type_props(card)
            flatten_art_props(card['card']['cardMagia'])
            flatten_art_props(card['card']['cardSkill'])
        for enCell in chara['chara']['enhancementCellList']:
            if ('emotionSkill' in enCell):
                flatten_art_props(enCell['emotionSkill'])

    path = path = os.path.abspath(os.path.join(
        os.path.dirname(__file__), '..', output_path))
    with open(path, 'w', encoding='utf-8-sig') as f:
        s = json.dumps(data).replace("\\/", "/").replace("\\\"",
                                                         "/\"").encode().decode('unicode_escape').replace("/\"", "\\\"")
        f.write(s)
    print('process json success')
    return data


def process_json_from_file():
    path = os.path.abspath(os.path.join(
        os.path.dirname(__file__), '..', input_path))
    with open(path, 'r', encoding='utf-8-sig') as f:
        data = json.load(f)

    data = process_json(data)

    return data


if __name__ == "__main__":
    process_json_from_file()
