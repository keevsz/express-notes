const express = require("express")
const { engine } = require("express-handlebars")
const database = require("./config/mongo")
const session = require("express-session")
const passport = require("passport")
const flash = require("connect-flash")
const csrf = require("csurf")
const MongoStore = require("connect-mongo")
const mongoSanitize = require("express-mongo-sanitize")
const moment = require("moment")
const cors = require("cors")

const User = require("./models/User")
require("dotenv").config()

const app = express()

app.use(flash())
app.use(cors())

app.set("trust proxy", 1)

app.use(
  session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: false,
    name: "session-user",
    store: MongoStore.create({
      clientPromise: database,
      dbName: process.env.DBNAME,
    }),
    cookie: {
      secure: process.env.MODO === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  })
)
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((user, done) =>
  done(null, { id: user._id, userName: user.userName })
)
passport.deserializeUser(async (user, done) => {
  const userdb = await User.findById(user.id)
  return done(null, { id: userdb._id, userName: userdb.userName })
})
//---------

app.engine(
  ".hbs",
  engine({
    extname: ".hbs",
    partialsDir: ["views/components"],
    helpers: {
      formatDate: function (date) {
        moment.locale("es")
        const newDate = moment(date).calendar()
        return newDate
      },
    },
  })
)
app.set("view engine", ".hbs")
app.set("views", "./views")

app.use(express.static(__dirname + "/public"))
app.use(express.urlencoded({ extended: true }))

app.use("/", require("./routes/HomeRoute"))
app.use("/", require("./routes/AuthRoute"))

app.use(csrf())
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use(mongoSanitize())

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log("Puerto: " + PORT)
  console.log("Conectando...")
})
