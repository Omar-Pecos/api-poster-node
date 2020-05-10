const db = require('../models');
const User = db.user;
const Role = db.role;

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
    User.find({},(err,users) =>{
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
    })
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
        if (user.progress.length > 0){
          progressArray = user.progress;
        }
          var obj = { 
            post_id : params.post_id,
            content : params.content,
            date : Date.now()
          }
          
          progressArray.push(obj);
          user.progress = progressArray;

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
        
      const helpArray = progressArray.filter(obj => obj.post_id !== postId);
      user.progress = helpArray;
      
      user.save();

          return res.status(200).send({
            status : 'success',
            user
        });
    
    });
  }


  