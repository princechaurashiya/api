require("../db/connections")
let mongoose=require('mongoose');

let BookingSchema=new mongoose.Schema ({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',  
        required: true  
    },
    profesonal_id:{
type: mongoose.Schema.Types.ObjectId, 
        ref: 'Profasonals',  
        required: true  
    },
    Product_desc:{
type:String
    },
    date: {
        type: Date,
        default: Date.now  
    },
profesonal_name:{
    type: String,
},
profesonal_phone:{
    type: Number,
},
fees:{
    type: Number, 
},
work_status:{
    type:String
},
contact_withIn: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 60 * 1000)  
},
address:{
    type: String,
}

})

let BookingModel=new mongoose.model('BookingModel',BookingSchema);
module.exports=BookingModel

