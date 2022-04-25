'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const dataValueSchema = new Schema({
    hexValue: { type: String, required: true },
    decValue: { type: Number, required: true },
    unit: { type: String, },
}, );

export default mongoose.model('dataValue', dataValueSchema);