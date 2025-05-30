import mongoose, { Schema } from "mongoose"
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const subscriptionSchema = new Schema({
subscriber:{
    type:Schema.Types.ObjectId,
    required:true,
    ref:"User"
},
channel:{
    type:Schema.Types.ObjectId,
    required:true,
    ref:"User"
}
},{
    timestamps:true
})

subscriptionSchema.plugin(aggregatePaginate)
export const Subscription = mongoose.model("Subscription",subscriptionSchema)