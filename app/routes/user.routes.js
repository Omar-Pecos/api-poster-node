const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //test
  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  /* Usuarios */

  app.get('/api/users',[authJwt.verifyToken, authJwt.isAdmin],controller.getUsers);
  app.get('/api/user/:id',[authJwt.verifyToken],controller.getUser);
  app.put('/api/users/edit/:id', [authJwt.verifyToken], controller.editUser);
  app.get('/api/users/grant/:id',[authJwt.verifyToken, authJwt.isAdmin], controller.grantPrivileges);
  app.get('/api/users/revoke/:id',[authJwt.verifyToken, authJwt.isAdmin], controller.revokePrivileges);
  app.get('/api/users/block/:id',[authJwt.verifyToken, authJwt.isAdmin], controller.blockUser);
  app.delete('/api/users/delete/:id',[authJwt.verifyToken, authJwt.isAdmin], controller.deleteUser);
  app.post('/api/users/setprogress',[authJwt.verifyToken] , controller.setProgress);
  app.post('/api/users/unsetprogress',[authJwt.verifyToken] , controller.unsetProgress);
};