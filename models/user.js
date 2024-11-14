import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
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
        ref: 'Subscription', // Assuming you have a Subscription model
        default: null
    }
}, { timestamps: true });

const User = models.User || mongoose.model('User', userSchema);

export default User;
