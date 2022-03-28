const mongoose = require("mongoose")
const { Schema } = mongoose

const noteSchema = new Schema({
  title: {
    type: String,
    default: "Sin título",
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
})

noteSchema.pre("save", async function (next) {
  const note = this
  try {
    note.title === "" ? "Sin titulo" : note.title
    next()
  } catch (error) {
    throw new Error("Error")
  }
})

const Note = mongoose.model("Note", noteSchema)
module.exports = Note
