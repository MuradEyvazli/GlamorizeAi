import mongoose,{Schema, models} from "mongoose";

const subSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    creditspermonth: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    
    
},{timestamps:true})

const Subscription = models.Subscription || mongoose.model('Subscription', subSchema)

export default Subscription