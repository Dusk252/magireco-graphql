//const charJson = require('./../json/charaCard_parsed.json');
const graphqlFields = require('graphql-fields');

//depth up to which to specify field inclusion in the project query
//gotta be careful if we have per-field resolvers
const projectArgDepth = 2;

//we need full knowledge of the queried fields if we wanna be efficient about database requests
function getFieldStringSelectors(fieldsObj, maxDepth) {
    let stack = [];
    let mongoFieldsObj = {};
    let depth = 0;
    stack.push({ fields: fieldsObj, stringRep: '', depth });
    while (stack.length > 0) {
        let node = stack.pop();
        let nodeKeys = Object.keys(node.fields);
        if (nodeKeys.length && node.depth < maxDepth) {
            nodeKeys.forEach((key) => {
                stack.push({
                    fields: node.fields[key],
                    stringRep: node.stringRep + (node.stringRep.length ? '.' : '') + key,
                    depth: node.depth + 1
                });
            });
        } else mongoFieldsObj[node.stringRep] = 1;
    }
    return mongoFieldsObj;
}

const getCharacterById = async function (_, { id }, { collection }) {
    return collection.findOne({ charaId: id });
};
const getCharactersById = async function (_, { ids }, { collection }) {
    const characterList = await collection.find({ charaId: { $in: ids } }).toArray();
    return {
        count: characterList.length,
        charaList: characterList
    };
};
const getCharacters = async function (_, { types, attributes, seishinKyouka, name, commandTypes }, { collection }, info) {
    commandTypeMap = {};
    commandTypes.forEach((type) => (commandTypeMap[type] = commandTypeMap[type] != null ? commandTypeMap[type] + 1 : 1));

    const selections = graphqlFields(info, {}, { processArguments: true });
    const fields = getFieldStringSelectors(selections['charaList'], projectArgDepth);

    let finalQuery = [];

    let queries = [];
    if (name !== null) queries.push({ $or: [{ 'chara.name': { $regex: name } }, { 'chara.kana': { $regex: name } }] });
    if (types.length) queries.push({ 'chara.initialType': { $in: types } });
    if (attributes.length) queries.push({ 'chara.attributeId': { $in: attributes } });
    if (seishinKyouka !== null) {
        queries.push({ 'chara.enhancementCellList': seishinKyouka ? { $not: { $size: 0 } } : { $size: 0 } });
    }
    finalQuery.push({ $match: queries.length ? { $and: queries } : {} });
    finalQuery.push({ $project: fields });

    if (commandTypes.length) {
        let commandTypesSetQuery = {};
        let commandTypesMatchQuery = [];

        Object.keys(commandTypeMap).forEach((key) => {
            //we need to count how many times each key appears in the character's card
            commandTypesSetQuery[key + 'Count'] = {
                $size: {
                    $filter: {
                        input: { $arrayElemAt: ['$cardList.card.commandTypeList', 0] },
                        as: 'type',
                        cond: { $eq: ['$$type', key] }
                    }
                }
            };
            //and compare it to the count of said key in our argument
            commandTypesMatchQuery.push({
                [key + 'Count']: { $gte: commandTypeMap[key] }
            });
        });
        finalQuery.push({ $set: commandTypesSetQuery });
        finalQuery.push({ $match: { $and: commandTypesMatchQuery } });
    }
    const characterList = await collection.aggregate(finalQuery).toArray();

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
    //resolvers for inner fields won't work past depth 2 if fields aren't grabbed so being careful about it
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
