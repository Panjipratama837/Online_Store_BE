module.exports = (mongoose) => {
    const postSchema = mongoose.Schema({
        totalResults: {
            type: Number,
        },
        title: String,
        description: String,
        published: Boolean,
        name : {
            firstName: String,
            lastName: String
        }
    }, { timestamps: true });

    postSchema.method('toJSON', function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });


    // Get name tabel
    const post = mongoose.model('express mongo basics', postSchema);
    return post;
}

