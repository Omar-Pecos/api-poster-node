/* Requirements */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

/* Create express App */
const app = express();

/* Cors */
var corsOptions = {
    origin : "http://localhost:8081"
};

app.use(cors(corsOptions));

/*  Body-parser */
    // parse requests of content-type - application/json
app.use(bodyParser.json());
    // parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended : true}));


/* Mongoose !!! */
const db = require('./app/models');
const dbConfig = require('./app/config/db.config');
const Role = db.role;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

    // initial()-> inicializa el documento de Roles
    function initial() {
        Role.estimatedDocumentCount((err, count) => {
          if (!err && count === 0) {
            new Role({
              name: "user",
              type : 0
            }).save(err => {
              if (err) {
                console.log("error", err);
              }
      
              console.log("added 'user' to roles collection");
            });
      
      
            new Role({
              name: "admin",
              type : 1
            }).save(err => {
              if (err) {
                console.log("error", err);
              }
      
              console.log("added 'admin' to roles collection");
            });
          }
        });
      }


/* Test route */
app.get('/', (req,res) =>{
    res.json({message : "Hello world!!"});
});

/* Routes */
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);


/* set Port, listen for requests */
const PORT = process.env.PORT || 8080;

app.listen(PORT, () =>{
    console.log(`Servidor corriendo en puerto : ${PORT} `);
});