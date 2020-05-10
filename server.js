/* Requirements */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

/* Create express App */
const app = express();

/* Cors */
var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

/*  Body-parser */
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


/* Mongoose !!! */
const db = require('./app/models');
const dbConfig = require('./app/config/db.config');
//Para initial()
const Role = db.role;
const User = db.user;
const bcrypt = require('bcryptjs');

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initialRoles();
    initialUsers(); 
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// initial()-> inicializa el documento de Roles
function initialRoles() {

  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
    new Role({
        _id: "5eb7e3869b99552b1c54d4e6",
        name: "user",
        type: 0
      }).save((err, role) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

     new Role({
        _id:"5eb7e3869b99552b1c54d4e7",
        name: "admin",
        type: 1
      }).save((err, role) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'admin' to roles collection");
      });
    }
  });
}
// initial()-> inicializa el documento de User
function initialUsers() {

  /// now add Users
  User.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {

      new User({
        fullname: "userfull",
        username: "user",
        email: "user@user.com",
        roles: ["5eb7e3869b99552b1c54d4e6"],
        password: bcrypt.hashSync("user", 8),
        active: 1
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to users collection");
      });

      new User({
        fullname: "adminfull",
        username: "admin",
        email: "admin@admin.com",
        roles: ["5eb7e3869b99552b1c54d4e7"],
        password: bcrypt.hashSync("admin", 8),
        active: 1
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to users collection");
      });
    }
  });
}


/* Test route */
app.get('/', (req, res) => {
  res.json({ message: "Hello world!!" + new Date().toUTCString() });
});

/* Routes */
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/post.routes')(app);


/* set Port, listen for requests */
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto : ${PORT} `);
});