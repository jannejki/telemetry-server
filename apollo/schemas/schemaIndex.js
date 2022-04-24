'use strict';
import { gql } from 'apollo-server-express';
import dataSchema from './dataSchema.js';

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
    dataSchema,
];