// Core imports
import path from 'path';
import { fileURLToPath } from 'url';

// Dependencies
import express from 'express';
import { engine } from 'express-handlebars';
import esMain from 'es-main';
import bodyParser from 'body-parser';
import multiparty from 'multiparty';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';

// App Local
import handlers from './src/lib/handlers.mjs';
import credentials from './config.mjs';
import utilMiddleware from './src/lib/middleware/NinjaCodersUtil.mjs';
import { weatherMiddleware } from './src/lib/middleware/weather.mjs';
import flashMiddleware from './src/lib/middleware/flash.mjs';
import productsMiddleware from './src/lib/middleware/products.mjs';
import requiresDeposit from './src/lib/middleware/productRequiresDeposit.mjs';


// Setup path handlers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Configure Handlebars view engine
app.engine('handlebars', engine({
    defaultLayout: 'main',
    helpers: {
        section: function(name, options) {
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        },
        ifeq: function(arg1, arg2, options) {
            return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
        },
        ifgt: function(arg1, arg2, options) {
            return (arg1 > arg2) ? options.fn(this) : options.inverse(this);
        }
    }
}));
app.set('view engine', 'handlebars');
app.set('views', 'src/views');

// Middleware
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(credentials.cookieSecret));
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret
}));
app.use(utilMiddleware);
app.use(weatherMiddleware);
app.use(flashMiddleware);
app.use(productsMiddleware);
app.use(requiresDeposit);


// Routes
app.get('/', handlers.home);
app.get('/about', handlers.about);
app.get('/colormode/:mode', handlers.colorMode);
app.get('/masterclass', handlers.masterclass);
app.get('/cart', handlers.cart);
app.post('/add-to-cart', handlers.addToCart);
app.post('/change-cart-item-qty', handlers.changeCartItemQty);
app.post('/delete-from-cart', handlers.deleteFromCart);
app.post('/checkout', handlers.checkout);

// Ajax Newsletter
app.get('/newsletter', handlers.newsletter);
app.post('/api/newsletter-signup', handlers.api.newsletterSignup);
app.get('/newsletter/archive', handlers.newsletterArchive);

// Setup Photo Contest
app.get('/contest/setup-photo', handlers.setupPhotoContest);
app.post('/api/setup-photo-contest/:year/:month', (req, res) => {
    const form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
        if (err) return handlers.api.setupPhotoContestError(req, res, err.message);
        handlers.api.setupPhotoContest(req, res, fields, files);
    });
});

// Error handling
app.use(handlers.notFound);
app.use(handlers.serverError); 

if (esMain(import.meta)) {
    app.listen(port, () =>
        console.log(
            `Express started on http://localhost:${port}; ` +
        'press Ctrl-C to terminate.'
        )
    );
}

export default app;