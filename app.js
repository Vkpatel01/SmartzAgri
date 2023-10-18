
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import ejs from "ejs";
import dotenv from "dotenv";
import mysql from "mysql2"


import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Now you can use __dirname in your code


dotenv.config();
const PORT = 3000;
const app = express();

app.set('view engine', 'ejs');
app.set('strict routing', true);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));  


const pool = mysql.createPool({
    host: process.env.dbHOST,
    user: process.env.dbUSER,
    password: process.env.dbPASSWORD,
    database: process.env.dbNAME
}).promise(); // here using promise so we can use async ,instead of clasic callback

pool.getConnection().then(connection => {
        console.log('Database connected');

        // Release the connection when done with it
        connection.release();
    }).catch(error => {
        console.error('Error connecting to the database:', error.message);
    });

let curentUser={
  username:"",
  password:""
}






    
  
    
    













app.get("/", async (req, res) => {
    try {
        res.sendFile(__dirname+"/index.html");
        
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).send('Internal Server Error');
    } 
});


app.get("/login", async(req,res)=>{
    try {
        res.render("login");
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/signup", async(req,res)=>{
    try {
        res.render("signup");
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/logout", (req,res)=>{
    res.redirect("/login");
})

app.get("/crop", (req,res)=>{
    res.render("crop");
})



app.post('/login', async (req, res) => {
    try {
      const {username, password } = req.body;
      curentUser={username,password};

        // Fetch user from the Employee database
        const results = await pool.query('SELECT * FROM user WHERE email =?', [username]);
      
        // Check if user with provided username exists
        if (results.length > 0) {
          const [user] = results[0];
          if (password === user.password) {
            res.render("dashboard",{user:user});
          } 
          else {
            // res.send('Incorrect password');
            // res.redirect('/login');
            res.send('<script>alert("Incorrect password"); window.location="/login";</script>');
          }
        } 
        else {
        //   res.send('User not found');
        res.send('<script>alert("User not found!"); window.location="/login";</script>');
        }
      
      
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
app.post("/signup", async(req,res)=>{
    try {
        const { username, email, password, name, phone_number, gender } = req.body;
        // curentUser={username,password};
        pool.query('INSERT INTO user (username, email, password, name, phone_number, gender) VALUES (?, ?, ?, ?, ?, ?)', [username, email, password, name, phone_number, gender],(error, results) => {
            if (error) throw error;
                res.redirect('/login');
        });

        // res.render("dashboard");
        res.render("crop");
        
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});



// 404 error handling
app.use((req, res, next) => {
    res.status(404).render("404");
});

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server started on port ${PORT}`);
});