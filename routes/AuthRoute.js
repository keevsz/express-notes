const express = require("express")
const router = express.Router()
const { body } = require("express-validator")

const {
  loginForm,
  loginUser,
  registerForm,
  registerUser,
  logOut,
} = require("../controllers/AuthController")

router.get("/login", loginForm)
router.post(
  "/login",
  [
    body("email", "Ingrese un email válido").trim().isEmail().normalizeEmail(),
    body("password", "Ingrese un password válido")
      .trim()
      .isLength({ min: 6 })
      .escape(),
  ],
  loginUser
)

router.get("/register", registerForm)
router.post(
  "/register",
  [
    body("username", "Ingrese un nombre válido").trim().notEmpty().escape(),
    body("email", "Ingrese un email válido").trim().isEmail().normalizeEmail(),
    body("password", "Ingrese un password válido")
      .trim()
      .isLength({ min: 6 })
      .escape()
      .custom((value, { req }) => {
        if (value !== req.body.repassword) {
          console.log(req.body.repassword + value)
          throw new Error("No coinciden las contraseñas")
        } else {
          return value
        }
      }),
  ],
  registerUser
)

router.get("/logout", logOut)

module.exports = router
