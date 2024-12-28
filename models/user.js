import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true 
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        lowercase: true 
    },
    password: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 100
    },
    subscriptionStatus: {
        type: Boolean,
        default: false
    },
    subscriptionId: {
        type: Schema.Types.ObjectId,
        ref: 'Subscription',
        default: null
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    lastLogin: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const User = models.User || mongoose.model('User', userSchema);

export default User;
