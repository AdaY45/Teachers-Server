const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
    name: { type: String, requires: true, unique: true },
    email: { type: String, requires: true, unique: true },
    password: { type: String, requires: true },
});

const modelSchema = model("User", schema);

module.exports = { User: modelSchema };
