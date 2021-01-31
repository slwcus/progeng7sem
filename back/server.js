const constants = require('./constants.js'),
express = require('express'),
mongoose = require('mongoose'),
morgan = require('morgan'),
cors = require('cors'),
jwt = require('jsonwebtoken'),
path = require('path'),
cookieParser = require('cookie-parser'),
fileUpload = require('express-fileupload');

const app = express();

app.use(fileUpload());
app.use(cors())
app.use(cookieParser())

app.set('port', constants.PORT);


app.listen(app.get('port'), () => {
    console.log(`[OK] Server is running on localhost:${app.get('port')}`);
});
 
mongoose.connect(constants.DB_PATH, { useNewUrlParser: true })
    .then(db => console.log('[OK] DB is connected'))
    .catch(err => console.error(err));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(morgan('dev'));

app.use(`${constants.API_PATH}/users`, require('./routes/usersRouter'));
app.use(`${constants.API_PATH}/events`, require('./routes/eventsRouter'));
app.use(`${constants.API_PATH}/documents`, require('./routes/documentsRouter'));
app.use(`${constants.API_PATH}/utility`, require('./routes/utilityRouter'));
app.use(`${constants.API_PATH}/records`, require('./routes/records'));
app.use(`${constants.API_PATH}/auth`, require('./routes/authRouter'));


app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Перелогинься');
    console.log(err)
  }
});

app.use('/', express.static(path.join(__dirname, './res/dist')));
app.use('*', express.static(path.join(__dirname, './res/dist')));


