const {authJwt} = require('../middlewares');
const controller = require('../controllers/post.controller');

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

    //Categories
    app.get('/api/category/:theme?', controller.getCategories);
   // app.get('/api/cat/:name', controller.getCategory);
    app.post('/api/category/create', [authJwt.verifyToken, authJwt.isAdmin] , controller.createCategory);
    app.put('/api/category/edit/:id', [authJwt.verifyToken, authJwt.isAdmin] , controller.editCategory);
    app.delete('/api/category/delete/:id', [authJwt.verifyToken, authJwt.isAdmin] , controller.deleteCategory);

    // Posts
    app.post('/api/posts/create', [authJwt.verifyToken],controller.createPost);
    app.put('/api/posts/edit/:id', [authJwt.verifyToken],controller.editPost);
    app.delete('/api/posts/delete/:id', [authJwt.verifyToken] , controller.deletePost);
    app.get('/api/posts/:last?',controller.getPosts);
    app.get('/api/post/:id',controller.getPost);
    app.post('/api/post/favorite', [authJwt.verifyToken], controller.markAsFavorite);
    app.post('/api/post/unfavorite', [authJwt.verifyToken], controller.unmarkAsFavorite);
    app.get('/api/searchposts/:search?',controller.searchPosts);
    app.get('/api/filterposts', controller.getPostsFiltered);
    app.post('/api/posts/collection',controller.getPostCollection);

}