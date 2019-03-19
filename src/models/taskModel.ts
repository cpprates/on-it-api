import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const TaskSchema = new Schema({
    title: {
        type: String,
    },
    details: {
        type: String,
    },
    priority: {
        type: String,
    },
    userId: {
        type: String,
        required: true,
    },
    start_date: {
        type: Date,
        default: Date.now
    },
    due_date: {
        type: Date
    },
    complete: {
        type: Boolean,
        default: false
    }
});