import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
      canNodes(CANID: String, name: String, fault: Boolean): [node]
  }

  type node {
      CANID: String,
      name: String,
      comments: [String]
      signals: [signals]
  }

  type signals {
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