import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const canNodeSchema = new Schema({
    canID: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
});

export default mongoose.model('canNode', canNodeSchema);