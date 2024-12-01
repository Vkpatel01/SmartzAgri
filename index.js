import express from "express";
import bodyParser from "body-parser";
import path from "path";
import ejs from "ejs";
import dotenv from "dotenv";
import axios  from 'axios';

import mongoose from "mongoose";

import { spawn } from "child_process";

dotenv.config();
mongoose.set('strictQuery', true);



// console.log(process.env.WEATHER_API_KEY); // Should log your API key
// console.log(process.env.API_URL);        // Should log your API URL
// console.log(process.env.API_KEY);        // Should log your Flask API key


// Local database
// mongoose.connect("mongodb://127.0.0.1:27017/cropDB").then(() => {
//     console.log("Connected to the database!");
// });

// MongoDB atlas database
const DBurl = process.env.databaseURL;

mongoose.connect(DBurl).then(() => {
  console.log("Connected to the database!");
});



import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const PORT =process.env.PORT || 4400;
const app = express();

app.set('view engine', 'ejs');
app.set('strict routing', true);

// Use body-parser middleware to parse JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));  

// crop schema for store data in mongoDB
const cropSchema = new mongoose.Schema({
    name : String,
    steps : {
        Land_Preparation: String,
        Soil_Testing: String,
        Seed_Selection: String,
        Sowing: String,
        Irrigation: String,
        Weed_Control: String,
        Fertilization: String,
        Disease_and_Pest_Management: String,
        Crop_Monitoring: String,
        Harvesting: String,
        Drying_and_Storage:String
      },
    cost : String
});

const Crop = mongoose.model("Crop",cropSchema );


  



app.get("/", async (req, res) => {
    try {
        res.render("index");
        
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).send('Internal Server Error');
    } 
});

app.get("/about", (req,res)=>{
    res.render("about");
})

app.get("/crop", (req,res)=>{
    res.render("crop",{prediction:" ",userValues:""});
})

app.get("/weather", (req,res)=>{
    const weatherApiKey = process.env.WEATHER_API_KEY;
    res.render("weather",{weatherApi:weatherApiKey});
})

/* Only for fill crop data  { development purpose }*/
/* 

// app.get("/form", (req,res)=>{
//     res.render("form");
// })

 app.post("/formSubmit", (req,res)=>{
    const inputCrop = req.body;

    const crop = new Crop({
        name : inputCrop.cropName, 
        steps : {
            Land_Preparation: inputCrop.Land_Preparation,
            Soil_Testing: inputCrop.Soil_Testing,
            Seed_Selection: inputCrop.Seed_Selection,
            Sowing: inputCrop.Sowing,
            Irrigation: inputCrop.Irrigation,
            Weed_Control: inputCrop.Weed_Control,
            Fertilization: inputCrop.Fertilization,
            Disease_and_Pest_Management: inputCrop.Disease_and_Pest_Management,
            Crop_Monitoring: inputCrop.Crop_Monitoring,
            Harvesting: inputCrop.Harvesting,
            Drying_and_Storage:inputCrop.Drying_and_Storage
          },
        cost : inputCrop.cost
    });

    crop.save();
    res.render("form");

})

*/

app.get("/processCultivation/:cropName", async (req, res) => {
    try {
      const reqCrop = req.params.cropName.toLowerCase(); // Convert to lowercase
  
      // Use the await keyword to wait for the Promise to resolve
      const foundCrop = await Crop.find({ name: { $regex: new RegExp("^" + reqCrop, "i") } });

      res.render("cropCultivation", { crop: foundCrop[0] });
    } catch (err) {
      // Handle the error appropriately
      console.error("Error querying database:", err);
      res.status(500).send("Internal Server Error");
    }
  });
  
  



/* Connecting Backend with ML model */



// Define the route to handle the prediction
app.post('/predict', async (req, res) => {
    console.log(req.body);
    try {
        const cropDetails = req.body;
        const userValues = [cropDetails.N,cropDetails.P,cropDetails.K,cropDetails.pH,cropDetails.rainfall,cropDetails.temperature]
        const data = {
            'N': cropDetails.N,
            'P': cropDetails.P,
            'K': cropDetails.K,
            'pH': cropDetails.pH,
            'rainfall': cropDetails.rainfall,
            'temperature': cropDetails.temperature
        };

        // Define the URL of your Flask API endpoint
        const url = process.env.API_URL;

        const API_KEY = process.env.API_KEY;

        // Define the headers with the API key
        const headers = {
            'api_key': API_KEY,
            'Content-Type': 'application/json'
        };

        // Make the POST request to the Flask API
        const response = await axios.post(url, data, { headers });
        const result = response.data.prediction;

        // console.log(result.trim());
        res.render("crop", { prediction: result, userValues: userValues });
    } catch (error) {
        console.error("Error:", error.response);
        res.status(500).send('Error in api call');
    }
});


app.post("/crop", (req,res)=>{
  res.render("crop",{prediction:" "});
})

app.post("/about", (req,res)=>{
    res.render("about");
})



// 404 error handling
app.use((req, res, next) => {
    res.status(404).render("404");
});

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server started on port ${PORT}`);
});
