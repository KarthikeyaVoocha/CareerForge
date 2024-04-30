import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import { engine } from 'express-handlebars';
import router from './routes/routes1.js';
const url="mongodb://localhost/CareerForge";

const app = express();

mongoose.connect(url,{useNewUrlParser:true});
const con=mongoose.connection;
con.on('open',()=>{
    console.log("connectes...");
})

// Session configuration
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 60 * 60 * 10000, 
        secure: false 
    }
}));

const recruiterSession = session({
    secret: 'recruiter-secret-key', // Change this to a different random string
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 60 * 60 * 1000, // Session expires after 1 hour of inactivity (adjust as needed)
        secure: false // Set to true if using HTTPS
    }
});
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views','./views');

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use('/',router);
app.use('/Login',router);
app.use('/Signup',router);


app.listen(3000,()=>{
    console.log("Server started");
});