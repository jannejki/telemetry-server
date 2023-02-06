'use strict';

import { gql } from 'apollo-server-express';

export default gql `
  extend type Query {
      users(NAME: String, PRIVILEGE: String): [user]
  }

  extend type Mutation {
    addUser(NAME: String,
            PASSWORD: String,
            rights: Boolean
            ): user,

    deleteUser(ID: Int!): user
    changePassword(ID: Int!, PASSWORD: String!): user
    changePrivilege(ID: Int!, PRIVILEGE: String!): user
    }

  type user {
      ID: Int,
      NAME: String,
      PRIVILEGE: String
  }
`;