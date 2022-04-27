import { gql } from 'apollo-server-express';

export default gql `
  extend type Query {
      canNodes(canID: String, name: String, rules: Boolean): [node]
  }

  type node {
      canID: String,
      name: String,
      rules: [rules]
  }

  type rules {
    name: String,
    startBit: String,
    length: String,
    endian: String,
    scale: String,
    offset: String,
    min: String,
    max: String,
    unit: String
  }
  
`;