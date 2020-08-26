const charJson = require('../json/charaCard_parsed.json');

const getCharacterById = function (_, { id }) {
    return charJson.charaList.filter((character) => {
        return character.charaId == id;
    })[0];
};
const getCharactersById = function (_, { ids }) {
    const characterList = charJson.charaList.filter((character) => {
        return ids.includes(character.charaId);
    });
    return {
        count: characterList.length,
        charaList: characterList
    };
};
const getCharacters = function (_, { types, attributes, seishinKyouka, name, commandTypes }) {
    const characterList = charJson.charaList.filter((character) => {
        commandIntersect = [];
        if (commandTypes.length > 0) {
            map = {};
            commandTypes.forEach((type) => (map[type] = map[type] != null ? map[type] + 1 : 1));
            character.cardList[0].card.commandTypeList.forEach((type) => {
                if (map[type] > 0) {
                    commandIntersect.push(type);
                    map[type] = map[type] - 1;
                }
            });
        }
        return (
            (name === null || character.chara.name.includes(name) || character.chara.kana.includes(name)) &&
            (types.length === 0 || types.includes(character.chara.initialType)) &&
            (attributes.length === 0 || attributes.includes(character.chara.attributeId)) &&
            (seishinKyouka === null ||
                (seishinKyouka && character.chara.enhancementCellList.length > 0) ||
                (!seishinKyouka && character.chara.enhancementCellList.length === 0)) &&
            commandIntersect.length === commandTypes.length
        );
    });
    return {
        count: characterList.length,
        charaList: characterList
    };
};

const resolvers = {
    Query: {
        characterById: getCharacterById,
        charactersById: getCharactersById,
        characters: getCharacters
    },
    Character: {
        cardList: (root, { cardRank }) => {
            if (cardRank === null || cardRank === 0) return root.cardList;
            else return root.cardList.filter((x) => x.card.rank === 'RANK_' + cardRank);
        }
    },
    Chara: {
        enhancementCellList: (root, { type }) => {
            if (type === null) return root.enhancementCellList;
            else return root.enhancementCellList.filter((x) => x.enhancementType === type);
        }
    }
};

module.exports.resolvers = resolvers;
