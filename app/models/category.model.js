module.exports = (mongoose) => {
    const categorySchema = mongoose.Schema({
        categoryName: {
            type: String,
            required: true
        }
    }, { timestamps: true })

    // add id from mongoose
    categorySchema.method('toJSON', function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });


    const category = mongoose.model('categories', categorySchema)

    return category
}