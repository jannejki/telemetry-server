'use strict';
import { gql } from 'apollo-server-express';
import canNodeSchema from './canNodeSchema.js';
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
    canNodeSchema
];