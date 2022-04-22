'use strict';

import mongoose from 'mongoose';
import canNode from './canNodeModel';

const Schema = mongoose.Schema;

const dataSchema = new Schema({
    canNode: { type: mongoose.Types.ObjectId, ref: canNode, required: true },
    DLC: { type: Number, required: true },
    data: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Data', dataSchema);