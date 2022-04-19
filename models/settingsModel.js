import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const settingsShcema = new Schema({
    activeDbc: { type: String, required: true },
});

export default mongoose.model('Settings', settingsShcema);