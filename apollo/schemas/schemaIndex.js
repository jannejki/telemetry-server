'use strict';
import { gql } from 'apollo-server-express';
import dataPointSchema from './dataPointSchema.js';
import dataValueSchema from './dataValueSchema.js';

const linkSchema = gql `
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`;

export default [
    linkSchema,
    dataPointSchema,
    dataValueSchema
];