'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const dataPointSchema = new Schema({
    CAN: { type: String, required: true },
    DLC: { type: Number, required: true },
    data: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('dataPoint', dataPointSchema);