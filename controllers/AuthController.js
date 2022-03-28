const User = require("../models/User")
const { validationResult } = require("express-validator")

const loginForm = (req, res) => {
  res.render("login", { mensajes: req.flash("messages") })
}

const loginUser = async (req, res) => {
  const { email, password } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    req.flash("messages", errors.array())
    return res.redirect("/login")
  }

  try {
    const user = await User.findOne({ email })
    if (!user) throw new Error("No existe este email")

    if (!(await user.comparePassword(password)))
      throw new Error("Contraseña incorrecta")

    req.login(user, function (error) {
      if (error) {
        throw new Error("Error al iniciar sesión")
      }
      return res.redirect("/")
    })
  } catch (error) {
    req.flash("messages", [{ msg: error.message }])
    return res.redirect("/login")
  }
}

const registerForm = (req, res) => {
  res.render("register", { mensajes: req.flash("messages") })
}

const registerUser = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    req.flash("messages", errors.array())
    return res.redirect("/register")
  }

  const { username, email, password } = req.body
  try {
    let user = await User.findOne({ email })
    if (user) throw new Error("Ya existe el usuario")

    user = await User.findOne({ username })
    if (user) throw new Error("Ya existe el email")

    user = new User({ username, email, password })
    await user.save()

    return res.redirect("/login")
    //..
  } catch (error) {
    req.flash("messages", [{ msg: error.message }])
    return res.redirect("/register")
  }
}

const logOut = async (req, res) => {
  try {
    req.logout()
    return res.redirect("/")
  } catch (error) {
    req.flash("messages", [{ msg: error.message }])
    return res.redirect("/register")
  }
}
module.exports = { loginForm, loginUser, registerForm, registerUser, logOut }
