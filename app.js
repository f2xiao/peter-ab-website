const express = require('express')
const expressHandlebars = require('express-handlebars')
const expressSession = require('express-session')
const productRouter = require('./routers/product-router')
const authRouter = require('./routers/auth-router')
const SQLiteStore = require('connect-sqlite3')(expressSession);

const app = express()

app.use(express.static('static'))

app.use(express.urlencoded({
	extended: false
}))

app.use(expressSession({
	secret: "asdsasdadsasdasdasds",
	saveUninitialized: false,
	resave: false,
	// Save the sessions in a session store.
	store: new SQLiteStore({
		db:'sessions.db'
	}),
}))

app.use(function(request, response, next){
	// Make the session available to all views.
	response.locals.session = request.session
	next()
})

app.engine('hbs', expressHandlebars({
	defaultLayout: 'main.hbs'
}))

app.use('/products', productRouter)
app.use('/auth', authRouter)

app.get('/', function (request, response) {
	console.log(request.headers.cookie);
	response.render('start.hbs')
})

app.get('/about', function(request, response){
	response.render('about.hbs')
})

app.listen(8080)