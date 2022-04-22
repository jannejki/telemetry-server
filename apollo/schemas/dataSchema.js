import { gql } from 'apollo-server-express';

export default gql `
  extend type Query {
      data(id: String, canNode:cannode,  DLC: String, data: String): [Data]
  }

  type Data {
      id: ID,
      node: canNode,
      DLC: String,
      data: String
  }
`;