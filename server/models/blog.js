const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numberViews:{
        type: Number,
        default: 0
    },
    likes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    dislikes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    images: {
        type: String,
        default: 'https://www.google.com.vn/imgres?imgurl=https%3A%2F%2Ftaoanhdep.com%2Fwp-content%2Fuploads%2F2022%2F10%2F728c01807da6b432dda6ccb8ccd94dc0.webp&tbnid=PDh1osSsCJKEpM&vet=12ahUKEwjswou3yPODAxU2f_UHHWFFD8IQMygSegQIARBs..i&imgrefurl=https%3A%2F%2Ftaoanhdep.com%2Fbai-viet%2Ftong-hop-meme-cho-meo-hai-huoc-de-gui-ban-be%2F&docid=saoFsFxc0LQ58M&w=480&h=406&q=meme&hl=vi&ved=2ahUKEwjswou3yPODAxU2f_UHHWFFD8IQMygSegQIARBs'
    },
    author: {
        type: String,
        default: 'ROLE_ADMIN'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);