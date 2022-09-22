'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const dataValueSchema = new Schema({
    hexValue: { type: String, required: true },
    decValue: { type: Number },
    unit: { type: String, },
    name: { type: String }
},);

export default mongoose.model('dataValue', dataValueSchema);