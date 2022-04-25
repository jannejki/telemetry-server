'use strict';

import mongoose from 'mongoose';
import dataValueModel from './dataValueModel';
const Schema = mongoose.Schema;

const dataPointSchema = new Schema({
    CAN: { type: String, required: true },
    DLC: { type: Number, required: true },
    data: [{ type: mongoose.Types.ObjectId, ref: dataValueModel, required: true }],
    timestamp: { type: String, required: true }
});

export default mongoose.model('dataPoint', dataPointSchema);