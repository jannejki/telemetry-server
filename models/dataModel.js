'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const dataSchema = new Schema({
    canNode: { type: String, required: true },
    DLC: { type: Number, required: true },
    data: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Data', dataSchema);