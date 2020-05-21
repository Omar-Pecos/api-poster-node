const db = require('../models');
const Category = db.category;
const Post = db.post;
const User = db.user;
const validator = require('validator');


/* Categories */
exports.getCategories = (req, res) => {
    var findBy = {};
    var theme = req.params.theme;

    if (theme !== null && theme !== undefined) {
        findBy = { theme: theme };
    }

    Category.find(findBy, (err, categories) => {
        if (err) {
            return res.status(500).send({
                status: 'error',
                message: 'Error en el servidor'
            });
        }
        return res.status(200).send({
            status: 'success',
            categories
        });
    });
}
/*exports.getCategory = (req,res) =>{

    var name = decodeURI(req.params.name);

    Category.find({name : name}, (err,category) =>{
            if (err){
                return res.status(500).send({
                    status : 'error',
                    message : 'Error en el servidor'
                });
            } 
                return res.status(200).send({
                    status : 'success',
                    category
                });
        });
}*/
exports.createCategory = (req, res) => {
    // Recoger parametros
    var params = req.body;

    //Validar
    try {
        var val_name = !validator.isEmpty(params.name);
        var val_theme = !validator.isEmpty(params.theme);
    } catch (err) {
        res.status(200).send({
            status: 'error', message: 'Faltan datos'
        });
    }

    if (val_name && val_theme) {
        // Crear el objeto a guardar
        var cat = new Category({
            name: params.name,
            theme: params.theme
        });
        // o cat.name = params.name !

        // Guardar el articulo
        cat.save((err, category) => {
            if (err) {
                return res.status(404).send({
                    status: 'error',
                    message: 'La categoría no se ha guardado !!'
                });
            }

            //Devolver una respuesta
            return res.status(200).send({
                status: 'success',
                category: category
            });
        });
    } else {
        return res.status(200).send({
            status: 'error',
            message: ' ¡ Los datos no son válidos !'
        });
    }

};

exports.editCategory = (req, res) => {
    var catId = req.params.id;
    var params = req.body;

    //Validar
    try {
        var val_name = !validator.isEmpty(params.name);
        var val_theme = !validator.isEmpty(params.theme);
    } catch (err) {
        res.status(200).send({
            status: 'error', message: 'Faltan datos'
        });
    }

    if (val_name && val_theme) {

        Category.findByIdAndUpdate({ _id: catId }, params, { new: true }, (err, category) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al actualizar!'
                });
            }

            if (!category) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el artículo!'
                });
            }

            return res.status(200).send({
                status: 'success',
                category
            });
        })

    } else {
        return res.status(200).send({
            status: 'error',
            message: ' ¡ Los datos no son válidos !'
        });
    }

}

exports.deleteCategory = (req, res) => {
    var catId = req.params.id;

    Category.findByIdAndDelete(catId, (err, category) => {
        if (err) {
            return res.status(500).send({
                status: 'error',
                message: 'Error al eliminar!'
            });
        }

        if (!category) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe la categoria'
            });
        }

        return res.status(200).send({
            status: 'success',
            category
        });
    })
}

/* Posts */

exports.createPost = async (req, res) => {

    var params = req.body;
    var userId = req.userId;
    var author = 'none';

    try {
        var val_user_id = !validator.isEmpty(userId);
        var val_title = !validator.isEmpty(params.title);
        var val_content = params.content !== [] ? true : false;
        var val_theme = !validator.isEmpty(params.theme);
        var val_category = !validator.isEmpty(params.category);

        await User.findById(userId, (err, user) => {
            if (err) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Error del servidor'
                });
            }
            author = user.fullname;
            //console.log(user.fullname);
        })

    } catch (e) {
        res.status(409).send({
            status: 'error', message: 'Faltan datos obligatorios'
        });
    }

    if (val_user_id && val_title && val_content && val_theme && val_category) {

        // crea el objeto post
        var p = new Post();

        // asigna valores
        p.user_id = userId;
        p.title = params.title;
        p.content = params.content;
        p.url_image = params.url_image;
        p.url_yt = params.url_yt;
        p.theme = params.theme;
        p.category = params.category;
        console.log("author >> " + author);

        p.author = author;

        // guarda

        p.save((err, post) => {
            if (err) {
                return res.status(404).send({
                    status: 'error',
                    message: 'El post no se ha guardado !!'
                });
            }

            //Devolver una respuesta
            return res.status(200).send({
                status: 'success',
                post
            });
        });

    } else {
        return res.status(409).send({
            status: 'error',
            message: ' ¡ Los datos no son válidos !'
        });
    }
}

exports.editPost = (req, res) => {
    var postId = req.params.id;
    var params = req.body;
    var userId = req.userId;

    try {
        var val_user_id = !validator.isEmpty(userId);
        var val_title = !validator.isEmpty(params.title);
        var val_content = params.content !== [] ? true : false;
        var val_theme = !validator.isEmpty(params.theme);
        var val_category = !validator.isEmpty(params.category);

    } catch (e) {
        res.status(409).send({
            status: 'error', message: 'Faltan datos obligatorios'
        });
    }

    if (val_user_id && val_title && val_content && val_theme && val_category) {

        Post.findByIdAndUpdate(postId, params, { new: true }, (err, post) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al actualizar!'
                });
            }

            return res.status(200).send({
                status: 'success',
                post
            });
        });
    } else {
        return res.status(409).send({
            status: 'error',
            message: ' ¡ Los datos no son válidos !'
        });
    }
}

exports.deletePost = (req, res) => {
    var postId = req.params.id;

    Post.findByIdAndDelete(postId, (err, post) => {
        if (err) {
            return res.status(500).send({
                status: 'error',
                message: 'Error al eliminar!'
            });
        }

        return res.status(200).send({
            status: 'success',
            post
        });

    });
}

exports.getPosts = (req, res) => {
    var last = req.params.last;
    var next = req.query.next;
    var previous = req.query.previous;

    var query = Post.find({});
    var cursorParams = { limit: 10 };

    //5 últimos
    if (last) {
        query.limit(5)
            .sort('-_id')
            .exec((err, posts) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en el servidor'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    posts
                });
            });
    } else {

        if (next) {
            cursorParams.next = next;
        }
        if (previous){
            cursorParams.previous = previous;
        }

        //All paginated
        Post.paginate(cursorParams)
            .then((result) => {
                return res.status(200).send({
                    status: 'success',
                    posts: result
                });
            }).catch((error) => {
                return res.status(500).send({
                    status: 'error',
                    error
                });
            });

        /*query.sort('-_id')
            .exec((err, posts) =>{
                if (err){
                    return res.status(500).send({
                        status : 'error',
                        message : 'Error en el servidor'
                    });
                } 
                    return res.status(200).send({
                        status : 'success',
                        posts
                    });
            });*/
    }
}

exports.getPost = (req, res) => {
    var postId = req.params.id;

    Post.findById(postId, (err, post) => {
        if (err) {
            return res.status(500).send({
                status: 'error500',
                message: 'Error en el servidor'
            });
        }

        if (!post) {
            return res.status(404).send({
                status: 'error404',
                message: 'No existe!'
            });
        }
        return res.status(200).send({
            status: 'success',
            post
        });
    });
}

exports.getPostCollection = (req, res) => {
    var collection = req.body.collection;

    Post.find({
        '_id': { $in: collection }
    })
        .sort('-date')
        .exec((err, posts) => {
            if (err) {
                return res.status(500).send({
                    status: 'error500',
                    message: 'Error en el servidor'
                });
            }

            return res.status(200).send({
                status: 'success',
                posts
            });
        });
}

exports.markAsFavorite = async (req, res) => {
    var params = req.body;

    var userId = req.userId;
    var postId = params.postId;

    var username = '';

    // Cojer Usuario y rellenar username
    const user = await User.findById(userId);
   
    username = user.username;
    var colFavs = [];

    if (user.favorites.length > 0) {
        colFavs = user.favorites;
    }
    colFavs.push(postId);

    user.favorites = colFavs;
    await user.save();

       
    // Cojer el post y rellenar favorites
      const post = await Post.findById(postId);

      var favoriteObj = {};
      if (Object.keys(post.favorites).length > 0) {
          favoriteObj = post.favorites;
      }
      favoriteObj[username] = true;

      post.favorites = favoriteObj;
      post.markModified('favorites');

     await post.save();

      return res.status(200).send({
          status: 'success',
          post
      });

  /*  User.findById(userId, (err, user) => {
        if (err) {
            return res.status(500).send({
                status: 'error',
                message: 'Error del servidor'
            });
        }

        username = user.username;
        var colFavs = [];

        if (user.favorites.length > 0) {
            colFavs = user.favorites;
        }
        colFavs.push(postId);

        user.favorites = colFavs;
        user.save();
    })*/

   /* Post.findById(postId, (err, post) => {
        if (err) {
            return res.status(500).send({
                status: 'error',
                message: 'Error del servidor'
            });
        }

        var favoriteObj = {};
        if (Object.keys(post.favorites).length > 0) {
            favoriteObj = post.favorites;
        }
        favoriteObj[username] = true;

        post.favorites = favoriteObj;
        post.markModified('favorites');

        post.save();

        return res.status(200).send({
            status: 'success',
            post
        });
    })*/
}

exports.unmarkAsFavorite = async (req, res) => {
    var params = req.body;

    var userId = req.userId;
    var postId = params.postId;

    var username = '';

    // cojer User y eliminar el favorito
    const user = await User.findById(userId);
    username = user.username;
    var colFavs;

    if (user.favorites.length > 0) {
        colFavs = user.favorites;
    }

    const helpArray = colFavs.filter(fav => fav !== postId);

    user.favorites = helpArray;
    await user.save();
    
    //cojer el post y eliminar esa key de este user

    const post = await Post.findById(postId);

    var favoriteObj;
    if (Object.keys(post.favorites).length > 0) {
        favoriteObj = post.favorites;
    }

    //delete esa propiedad
    delete favoriteObj[username];

    post.favorites = favoriteObj;

    post.markModified('favorites');
    await post.save();

    return res.status(200).send({
        status: 'success',
        post
    });

   /* User.findById(userId, (err, user) => {
        if (err) {
            return res.status(500).send({
                status: 'error',
                message: 'Error del servidor'
            });
        }

        username = user.username;
        var colFavs;

        if (user.favorites.length > 0) {
            colFavs = user.favorites;
        }

        const helpArray = colFavs.filter(fav => fav !== postId);

        user.favorites = helpArray;
        user.save();
    })*/

   /* Post.findById(postId, (err, post) => {
        if (err) {
            return res.status(500).send({
                status: 'error',
                message: 'Error del servidor'
            });
        }

        var favoriteObj;
        if (Object.keys(post.favorites).length > 0) {
            favoriteObj = post.favorites;
        }

        //delete esa propiedad
        delete favoriteObj[username];

        post.favorites = favoriteObj;

        post.markModified('favorites');
        post.save();

        return res.status(200).send({
            status: 'success',
            post
        });
    })*/
}

exports.searchPosts = (req, res) => {
    var searchString = 'nada';

    if (req.params.search) {
        searchString = req.params.search;
    }

    var query;

    if (searchString === 'nada') {
        query = Post.find({});
    } else {
        query = Post.find({
            "$or": [
                { 'title': { "$regex": searchString, "$options": "i" } },
                { 'content': { "$regex": searchString, "$options": "i" } },
            ]
        });
    }

    query.sort('-date')
        .exec((err, posts) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error del servidor'
                });
            }

            return res.status(200).send({
                status: 'success',
                posts
            });
        });
}

exports.getPostsFiltered = (req, res) => {
    //valores default
    var field = 'theme';
    var value = 'Recetas';

    var cursorParams = { limit: 5 };
    var previous = req.query.previous;
    var next = req.query.next;

    if (req.query.field && req.query.value) {
        field = req.query.field;
        value = req.query.value;
    }

    if (previous){
        cursorParams.previous = previous;
    }
    if (next){
        cursorParams.next = next;
    }

    var objFiltrado = {};
    objFiltrado[field] = decodeURI(value);

    cursorParams.query = objFiltrado;
    Post.paginate( cursorParams )
        .then((result) =>{
            return res.status(200).send({
                status: 'success',
                posts : result
            });
        })
        .catch((error) =>{
            return res.status(500).send({
                status: 'error',
                error
            });
        });

   /* Post.find(objFiltrado, (err, posts) => {
        if (err) {
            return res.status(500).send({
                status: 'error',
                message: 'Error del servidor'
            });
        }

        return res.status(200).send({
            status: 'success',
            posts
        });
    }).sort('-date');*/
}

