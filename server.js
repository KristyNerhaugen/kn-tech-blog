const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");

const app = express();
const PORT = process.env.PORT || 3001;

const sequelize = require("./config/connection");
// using express-session and sequelize store
const SequelizeStore = require("connect-session-sequelize")(session.Store);

// I used this site to figure out how to time out a user session after three minutes:
// https://stackoverflow.com/questions/23545838/session-timeout-after-inactivity-in-express-session-in-express-server
const sess = {
  secret: "Super secret secret",
  cookie: {
    expires: 180 * 1000,
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

// require helpers
const helpers = require("./utils/helpers");
const hbs = exphbs.create({ helpers });

// use handlebars
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// turn on routes
app.use(require("./controllers/"));

// connecting db and turn server on
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});
