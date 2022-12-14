module.exports = (mongoose) => {
    const postSchema = mongoose.Schema({
        productName: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        uploadPicture: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        quantity: {
            type: Array,
            required: true
        },

        size: {
            type: Array,
            required: true
        },

        totalQuantity: {
            type: Number,
            required: true
        }


    }, { timestamps: true });

    postSchema.method('toJSON', function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });


    // Get name tabel
    const post = mongoose.model('products', postSchema);
    return post;
}

