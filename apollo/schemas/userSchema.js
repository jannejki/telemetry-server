'use strict';

import { gql } from 'apollo-server-express';

export default gql `
  extend type Query {
      users(id: String, username: String, rights: Boolean): [user]
  }

  extend type Mutation {
    addUser(username: String,
            password: String,
            rights: Boolean
            ): user,

    deleteUser(id: String!): user
    changePassword(id: String!, password: String!): user
    }

  type user {
      id: ID,
      username: String,
      password: String,
      rights: Boolean
  }
`;