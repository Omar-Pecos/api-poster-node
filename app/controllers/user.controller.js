const db = require('../models');
const User = db.user;
const Role = db.role;
const bcrypt = require('bcryptjs');

 exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
  exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
  };
  
  exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };

  exports.getUsers = (req,res) =>{
    
    var next = req.query.next;
    var previous = req.query.previous;

    var cursorParams = { limit: 5 };

    if (next) {
      cursorParams.next = next;
    }
    if (previous){
        cursorParams.previous = previous;
    }

    User.paginate( cursorParams )
        .then((result) =>{
              return res.status(200).send({
                status: 'success',
                users: result
              });
          }).catch((error) => {
              return res.status(500).send({
                  status: 'error',
                  error
              });
        });

   /* User.find({},(err,users) =>{
      if (err){
        return res.status(500).send({
            status : 'error',
            message : 'Error del servidor'
        });
      }

      return res.status(200).send({
          status : 'success',
          users
      });
    });*/
  }

  exports.getUser = (req,res) =>{

 // var userId = req.userId;
 var userId = req.params.id;

   User.findById(userId,'-password',(err,user) =>{

      if (err){
        return res.status(500).send({
            status : 'error',
            message : 'Error del servidor'
        });
      }

      return res.status(200).send({
          status : 'success',
          user
      });
    });
  }

  exports.editUser = (req,res) =>{
    var params = req.body;
    
    var userObj = params.user;
    var passObj = params.pass;

    //busca el user
    User.findById( userObj._id, (err,user) =>{
      if (err){
        return res.status(500).send({
            status : 'error',
            message : 'Error del servidor'
        });
      }

        //si lleva contraseña (se quiere cambiar)
        if (userObj.password){
          var validPass = bcrypt.compareSync(userObj.password,user.password);

          if (!validPass){
                return res.status(409).send({
                  status : 'error',
                  message : 'La contraseña actual no es correcta'
              });
          }else{
              var newPass = passObj.new;
              var confirm = passObj.confirm;

              if (newPass != confirm){
                    return res.status(409).send({
                      status : 'error',
                      message : 'Las nuevas contraseñas no coinciden'
                  });
              }

                //Editar el user
               user.password = bcrypt.hashSync( newPass, 8);
          }
        }

        //Editar el user sin Pass
        user.fullname = userObj.fullname;
        user.username = userObj.username;
        user.email = userObj.email;

        user.save();

        //evitar que devuelva la password
        let userReturned = {...user._doc};
        delete userReturned.password;

        return res.status(200).send({
          status : 'success',
          user : userReturned
        });
        
    });
  }

  exports.grantPrivileges = (req,res) =>{

    var userId = req.params.id;

    var adminRolId;

    Role.findOne({name : 'admin'} , (err,rol) =>{
        if (err){
            return res.status(500).send({
              status : 'error',
              message : 'Error del servidor'
            });
        }

        adminRolId = rol._id;
    });

    User.findOne({_id : userId})
      .exec((err, user) =>{
        if (err){
          return res.status(500).send({
            status : 'error',
            message : 'Error del servidor'
          });
      }

        user.roles = [adminRolId];

        user.save((err,user) =>{
          if (err){
            return res.status(500).send({
              status : 'error',
              message : 'Error del servidor'
            });
         }

          return res.status(200).send({
            status : 'success',
            user 
          });
        });
    })

  }
  exports.revokePrivileges = (req,res) =>{

    var userId = req.params.id;

    var userRolId;

    Role.findOne({name : 'user'} , (err,rol) =>{
        if (err){
            return res.status(500).send({
              status : 'error',
              message : 'Error del servidor'
            });
        }

        userRolId = rol._id;
    });

    User.findOne({_id : userId})
      .exec((err, user) =>{
            if (err){
              return res.status(500).send({
                status : 'error',
                message : 'Error del servidor'
              });
          }

        user.roles = [userRolId];

        user.save((err,user) =>{
          if (err){
            return res.status(500).send({
              status : 'error',
              message : 'Error del servidor'
            });
         }

          return res.status(200).send({
            status : 'success',
            user 
          });
        });
    });

  }

  exports.blockUser = (req,res) =>{
    var userId = req.params.id;

    User.findByIdAndUpdate(userId,{active : 0},{new : true}, (err,user) =>{
      if (err){
        return res.status(500).send({
            status : 'error',
            message : 'Error del servidor'
        });
      }

      return res.status(200).send({
          status : 'success',
          user
      });
    });
    
  }

  exports.deleteUser = (req,res) =>{
      var userId = req.params.id;

      User.findByIdAndDelete(userId, (err,user) =>{
        if (err){
          return res.status(500).send({
              status : 'error',
              message : 'Error al eliminar!'
          });
      }


      return res.status(200).send({
          status : 'success',
          user
      });

      });
  }

  exports.setProgress = (req,res) => {
      var userId = req.userId;
      var params = req.body;

      User.findById(userId, (err,user) =>{
          if (err){
            return res.status(500).send({
                status : 'error',
                message : 'Error del servidor'
            });
        }
        var progressArray = [];
        var posProgressArray = -1;

        if (user.progress.length > 0){
          progressArray = user.progress;
        }

        //comprobar que no esta ese post_id
        for (var i = 0; i < progressArray.length ; i++){
          if (progressArray[i].post_id == params.post_id){
            posProgressArray = i;
              //console.log(posProgressArray);  
          }
        }
        
        if (posProgressArray == -1){
          //no existe esse post_id por lo tanto hace uno nuevo
          var obj = { 
            post_id : params.post_id,
            content : params.content,
            date : Date.now()
          }
          
          progressArray.push(obj);
          user.progress = progressArray;

        }else{
          var obj = { 
            post_id : params.post_id,
            content : params.content,
            date : Date.now()
          }
         // progressArray[posProgressArray] = obj;
          user.progress[posProgressArray] = obj;
        }

        user.markModified('progress');
          //guardar
          user.save();

            return res.status(200).send({
              status : 'success',
              user
          });
      
      });
    }
  
  exports.unsetProgress = (req,res) => {
    var userId = req.userId;
    var postId = req.body.post_id;

    User.findById(userId, (err,user) =>{
        if (err){
          return res.status(500).send({
              status : 'error',
              message : 'Error del servidor'
          });
      }

      var progressArray;

      if (user.progress.length > 0){
        progressArray = user.progress;
      }
        
      const helpArray = progressArray.filter(obj => obj.post_id != postId);
      user.progress = helpArray;
      
      user.markModified('progress');
      user.save();

          return res.status(200).send({
            status : 'success',
            user
        });
    
    });
  }


  