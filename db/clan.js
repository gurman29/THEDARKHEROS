const mongoose=require('mongoose')
const clanschema = new mongoose.Schema({
    tag: {
      type: String
    },
    name: {
      type: String
    },
    type: {
      type: String
    },
    description: {
      type: String
    },
    location: {
      type: String
    },
    badgeUrls: {
      type: String
    },
    clanLevel: {
      type: Number
    },
    clanPoints: {
      type: Number
    },
    clanVersusPoints: {
      type: Number
    },
    requiredTrophies: {
      type: Number
    },
    warFrequency: {
      type: String
    },
    warWinStreak: {
      type: Number
    },
    warWins: {
      type: Number
    },
    warTies: {
      type: Number
    },
    warLeague: {
      type: String
    },
    members: {
      type: Number
    }
})
  const Clan=mongoose.model('clans',clanschema)
  
  module.exports=Clan