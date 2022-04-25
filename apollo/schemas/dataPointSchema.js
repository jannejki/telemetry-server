import { gql } from 'apollo-server-express';

export default gql `
  extend type Query {
      dataPoint(id: String, CAN: String,  DLC: String, data: String, startTime: String, endTime: String): [dataPoint]
  }

  type dataPoint {
      id: ID,
      CAN: String,
      DLC: String,
      data: [dataValue],
      timestamp: String
  }

  input time {
    year: Int,
    month: Int,
    day: Int,
    hour: Int,
    min: Int,
    sec: Int,
    millisec: Int
  }
`;