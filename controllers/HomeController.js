const { redirect } = require("express/lib/response")
const Note = require("../models/Note")

const Home = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).lean()
    res.render("home", {
      notes,
      user: req.user,
      mensajes: req.flash("messages"),
    })
  } catch (error) {
    req.flash("messages", [{ msg: error.message }])
    return res.redirect("/")
  }
}

const noteForm = (req, res) => res.render("NoteForm")

const noteRegister = async (req, res) => {
  const { title, description } = req.body
  try {
    const note = new Note({ title, description, user: req.user.id })

    await note.save()
    return res.redirect("/")
  } catch (error) {
    req.flash("messages", [{ msg: error.message }])
    return res.redirect("/")
  }
}

const noteEditForm = async (req, res) => {
  const { id } = req.params
  try {
    const note = await Note.findById(id).lean()
    console.log("Hola 4")

    if (!note.user.equals(req.user.id)) throw new Error("Acceso invalido")

    return res.render("NoteForm", { note })
  } catch (error) {
    req.flash("messages", [{ msg: error.message }])
    return res.redirect("/")
  }
}

const noteEdit = async (req, res) => {
  const { id } = req.params
  const { title, description } = req.body
  try {
    const note = await Note.findById(id)

    if (!note.user.equals(req.user.id)) throw new Error("Acceso invalido")

    await note.updateOne({ title: title, description: description })
    return res.redirect("/")
  } catch (error) {
    req.flash("messages", [{ msg: error.message }])
    return res.redirect("/")
  }
}

const noteDelete = async (req, res) => {
  const { id } = req.params
  try {
    const note = await Note.findById(id)
    if (!note.user.equals(req.user.id)) throw new Error("Acceso invalido")

    await note.remove()
    return res.redirect("/")
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }])
    return res.redirect("/")
  }
}

module.exports = {
  Home,
  noteForm,
  noteRegister,
  noteEditForm,
  noteEdit,
  noteDelete,
}
