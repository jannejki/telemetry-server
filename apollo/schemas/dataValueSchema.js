import { gql } from 'apollo-server-express';

export default gql `
  extend type Query {
      dataValue(id: String, hexValue: String,  decValue: String, unit: String, name:String): [dataValue]
  }

  type dataValue {
      id: ID,
      hexValue: String,
      decValue: String,
      unit: String,
      name: String
  }
`;