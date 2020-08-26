const typeDefs = `
    type Query {
        characterById(id: Int!): Character
        charactersById(ids: [Int!]!): RootType
        characters(types: [String!] = [], attributes: [String!] = [], seishinKyouka: Boolean = null, name: String = null, commandTypes: [String!] = []): RootType
    }

    type RootType {
        count: Int,
        charaList: [Character!]
    }

    type Bonus {
        bonusCode: String!
        bonusNum: Int!
      }
      
      type Gift {
        id: Int!
        type: Int!
        name: String!
        attributeId: String!
        rank: Int!
        rankGift: String!
        price: Int!
        giftNum: Int!
      }
      
      type BonusList {
        bonus: Bonus!
        gift: Gift!
      }
      
      type CardCustomize {
        cardId: Int!
        bonusList: [BonusList!]
      }
      
      type Arts {
        artId: Int!
        verbCode: String!
        effectCode: String!
        targetId: String
        effectValue: Int
        growPoint: Int
        probability: Int
      }
      
      type CardSkill {
        id: Int!
        groupId: Int
        name: String!
        shortDescription: String
        arts: [Arts!]!
      }
      
      type CardMagia {
        id: Int!
        groupId: Int
        name: String!
        shortDescription: String
        arts: [Arts!]!
      }
      
      type Card {
        cardId: Int!
        charaNo: Int!
        miniCharaNo: Int
        magiaCharaNo: Int
        cardName: String!
        rank: String!
        attributeId: String!
        initialType: String!
        growthType: String!
        attack: Int!
        defense: Int!
        hp: Int!
        rateGainMpAtk: Int!
        rateGainMpDef: Int!
        magiaId: Int!
        skillId: Int!
        commandTypeList: [String!]!
        illustrator: String
        cardCustomize: CardCustomize
        maxPieceSkillList: [String]
        pieceSkillList: [String]
        cardSkill: CardSkill!
        cardMagia: CardMagia!
      }
      
      type CardList {
        cardId: Int!
        card: Card!
      }
      
      type Fourth {
        quantity: Int!
        id: Int!
        name: String!
        rank: Int!
      }
      
      type Third {
        quantity: Int!
        id: Int!
        name: String!
        rank: Int!
      }
      
      type Second {
        quantity: Int!
        id: Int!
        name: String!
        rank: Int!
      }
      
      type First {
        quantity: Int!
        id: Int!
        name: String!
        rank: Int!
      }
      
      type MagiaGiftList {
        fourth: [Fourth]
        third: [Third]
        second: [Second]
        first: [First]
      }
      
      type EnhancementCellList {
        charaEnhancementCellId: Int!
        groupId: Int!
        enhancementType: String!
        effectValue: Int
        needCC: Int!
        connectedCellIds: String
        pointX: Int!
        pointY: Int!
        connectedCellIdList: [Int!]
        emotionSkill: EmotionSkill
      }

      type EmotionSkill {
        id: Int!
        groupId: Int!
        name: String!
        type: String!
        shortDescription: String
        skillEffectRange: String
        arts: [Arts!]
      }
      
      type CharaMessageList {
        charaNo: Int!
        messageId: Int!
        message: String!
      }
      
      type Chara {
        id: Int!
        name: String!
        kana: String!
        attributeId: String!
        attackType: Int!
        initialType: String!
        growthType: String!
        enemyFlg: Boolean
        doubleUnitFlg: Boolean
        saleItemId: String
        description: String
        school: String
        designer: String
        voiceActor: String
        enhancementGroupId: Int
        magiaGiftList: MagiaGiftList
        enhancementCellList(type: String = null): [EnhancementCellList!]
        charaMessageList: [CharaMessageList!]
      }
      
      type Character {
        charaId: Int!
        cardList(cardRank: Int = null): [CardList!]
        chara: Chara!
      }
`;

module.exports.typeDefs = typeDefs;
