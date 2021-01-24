var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fileUpload = require('express-fileupload');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const pageRouter = require('./routes/page');
const postRouter = require('./routes/post');



const mongodb = require('./core/mongodb');

let backend = require('./backend/router');
const { getAdminFromID } = require('./backend/models/Admin');
const hook = require('./core/hook');

var app = express();



app.locals.hook = hook
app.locals.convertTimeToDate = (time) => {
  var date = new Date(time);
  return date.getDate() + ' Tháng ' + date.getMonth() + ', ' + date.getFullYear()
}



// view engine setup
// app.set('views', path.join(__dirname, 'backend/views'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload({
  createParentPath: true
}))




// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', pageRouter);
app.use('/chi-tiet', postRouter);
app.use('/the-loai', require('./routes/category'));
app.use('/test', require('./routes/test'));

// backend

async function adminMiddleware(req, res, next) {
  let { path } = req;
  let { login } = req.cookies;

  if (login) {
    req.login = JSON.parse(login)

    let user = await getAdminFromID(req.login._id);
    req.login = user

    res.locals.login = req.login
    res.locals.path = path;
    // console.log(path)
  }

  if (path === '/login') {

    if (login) {
      res.redirect('/admin');
    } else {
      next()
    }
  } else {

    if (login) {
      next()
    } else {
      res.redirect('/admin/login');
    }
  }

}



app.use('/admin', adminMiddleware, backend.middleware, backend.router);




// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});





// function loadPlugin() {
//   import('./plugins/messenger/index.js')
// }

// loadPlugin();

module.exports = app;
