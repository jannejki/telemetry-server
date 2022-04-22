import { gql } from 'apollo-server-express';

export default gql `
  extend type Query {
      canNodes(canID: String, name: String): [canNode]
  }

  type canNode {
    id: ID
    canID: String
    name: String
  }

  input cannode {
    canID: String
  }
`;