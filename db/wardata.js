const mongoose=require('mongoose')

const warschema = new mongoose.Schema({
    
        result: {
          type: String
        },
        endTime: {
          type: String
        },
        teamSize: {
          type: Number
        },
        clan: {
          tag: {
            type: String
          },
          name: {
            type: String
          },
          badgeUrls: {
            small: {
              type: String
            },
            large: {
              type: String
            },
            medium: {
              type: String
            }
          },
          clanLevel: {
            type: Number
          },
          attacks: {
            type: Number
          },
          stars: {
            type: Number
          },
          destructionPercentage: {
            type: Number
          },
          expEarned: {
            type: Number
          }
        },
        opponent: {
          tag: {
            type: String
          },
          name: {
            type: String
          },
          badgeUrls: {
            small: {
              type: String
            },
            large: {
              type: String
            },
            medium: {
              type: String
            }
          },
          clanLevel: {
            type:Number
          },
          stars: {
            type: Number
          },
          destructionPercentage: {
            type: Number
          }
        }
      
  })
const war=mongoose.model('war',warschema)

module.exports=war