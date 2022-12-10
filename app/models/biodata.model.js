module.exports = (mongoose) => {
    const schema = mongoose.Schema(
        {
            name: String,
            address: String,
        },
        { timestamps: true }
    );

    schema.method('toJSON', function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    // Get name tabel
    const biodata = mongoose.model('biodata', schema);
    return biodata;
}