const { buildSchema } = require('graphql')

// language=GraphQL Schema
module.exports = buildSchema(
    `
            type STKPush {
                amount: String!
                accountReference: String!
                callBackURL: String!
                description: String!
                phoneNumber: String!
            }

            input StkPushInput {
                amount: String!
                accountReference: String!
                callBackURL: String!
                description: String!
                phoneNumber: String!
            }
            type RootQuery {
                stkPush: [STKPush!]!
            }

            type RootMutation {
                sendSTKPush(stkInput:StkPushInput): STKPush
            }
            
            schema {
                query: RootQuery
                mutation: RootMutation
            }

  `
)