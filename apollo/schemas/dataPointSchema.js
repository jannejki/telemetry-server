import { gql } from 'apollo-server-express';

export default gql `
  extend type Query {
      dataPoint(id: String, CAN: String,  DLC: String, data: String): [dataPoint]
  }

  type dataPoint {
      id: ID,
      CAN: String,
      DLC: String,
      data: String
  }
`;