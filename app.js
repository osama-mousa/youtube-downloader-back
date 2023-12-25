const express = require('express');
const app = express();
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');


app.use(cors());
app.use((req, res, next) => {
  res.header('Content-Type', 'application/json');
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000,()=>{
  console.log('I am Listening in port 3000')
})


app.get('/', (req, res) => {
  res.status(200).send('hello world')
})

const links = []

app.post('/api/download', (req, res) => {
  const body = req.body
  links.push(body)
  console.log(body)
  res.status(201).json({body}).send('Done!')
})

app.get('/api/download',(req,res)=>{
  res.json({
    links
  })
})




app.post('/api/downloadVideo', async (req, res) => {
  const link = req.body.link;

  try {
    const filePath = await downloadVideo(link);
    console.log(`Video downloaded successfully: ${filePath}`);
    // res.send(`Video downloaded successfully: ${filePath}`);
    // res.sendFile(filePath);

    const absolutePath = path.resolve(filePath);
    // إرسال الملف كاستجابة
    res.setHeader('Content-Type', 'video/mp4');
    res.sendFile(absolutePath);
    
  } catch (error) {
    console.error(`Error downloading video: ${error}`);
    res.status(500).send('Internal Server Error');
  }
});

function downloadVideo(link) {
  return new Promise((resolve, reject) => {
    const command = `python3 YouTube.py ${link}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

















// var createError = require('http-errors');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;