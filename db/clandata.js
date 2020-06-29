const mongoose=require('mongoose')
const clanschema = new mongoose.Schema({
  tag: {
    type: String
  },
  name: {
    type: String
  },
  role: {
    type: String
  },
  expLevel: {
    type: Number
  },
  league: {
    id: {
      type: Number
    },
    name: {
      type: String
    },
    iconUrls: {
      small: {
        type: String
      },
      tiny: {
        type: String
      },
      medium: {
        type: String
      }
    }
  },
  trophies: {
    type: Number
  },
  versusTrophies: {
    type: Number
  },
  clanRank: {
    type: Number
  },
  previousClanRank: {
    type: Number
  },
  donations: {
    type: Number
  },
  donationsReceived: {
    type: Number
  }
})
const Player=mongoose.model('members',clanschema)

module.exports=Player