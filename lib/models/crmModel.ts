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
        type: String
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});