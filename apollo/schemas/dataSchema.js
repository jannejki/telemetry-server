import { gql } from 'apollo-server-express';

export default gql `
  extend type Query {
      data(id: String, canNode: String,  DLC: String, data: String): [Data]
  }

  type Data {
      id: ID,
      node: String,
      DLC: String,
      data: String
  }
`;