const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    products: [
        {
            product: {type: mongoose.Types.ObjectId, ref: 'Product'},
            count: Number,
            color: String,

        }
    ],
    status:{
        type:String,
        default: 'Pending',
        enum:['Cancelled', 'Pending', 'Successed']
    },
    paymentMethod:{
    },
    orderBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
});

//Export the model
module.exports = mongoose.model('Order', orderSchema);