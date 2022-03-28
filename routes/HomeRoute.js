const express = require("express")
const {
  Home,
  noteForm,
  noteRegister,
  noteEditForm,
  noteEdit,
  noteDelete,
} = require("../controllers/HomeController")
const verifyUser = require("../middlewares/verifyUser")
const router = express.Router()

router.get("/", verifyUser, Home)

router.get("/new", verifyUser, noteForm)
router.post("/new", verifyUser, noteRegister)

router.get("/note/:id", verifyUser, noteEditForm)
router.post("/note/:id", verifyUser, noteEdit)

router.get("/delete/:id", verifyUser, noteDelete)

module.exports = router
