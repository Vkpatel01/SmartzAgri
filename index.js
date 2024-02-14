import express from "express";
import bodyParser from "body-parser";
import path from "path";
import ejs from "ejs";
import dotenv from "dotenv";


import mongoose from "mongoose";

import { spawn } from "child_process";

dotenv.config();
mongoose.set('strictQuery', true);

// Local database
mongoose.connect("mongodb://127.0.0.1:27017/cropDB").then(() => {
    console.log("Connected to the database!");
});

// MongoDB atlas database
const uri = process.env.databaseURL;

// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
//   console.log("Connected to the database!");
// });


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

app.get("/userManual", (req,res)=>{
    res.render("userManual");
})

app.get("/about", (req,res)=>{
    res.render("about");
})

app.get("/crop", (req,res)=>{
    res.render("crop",{prediction:" ",userValues:""});
})

// only to fill crop data
app.get("/form", (req,res)=>{
    res.render("form");
})

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

app.get("/processCultivation/:cropName", async (req, res) => {
    try {
      const reqCrop = req.params.cropName.toLowerCase(); // Convert to lowercase
  
      // Use the await keyword to wait for the Promise to resolve
      const foundCrop = await Crop.find({ name: { $regex: new RegExp("^" + reqCrop, "i") } });
    //   console.log(foundCrop[0].name, reqCrop);
      res.render("cropCultivation", { crop: foundCrop[0] });
    } catch (err) {
      // Handle the error appropriately
      console.error("Error querying database:", err);
      res.status(500).send("Internal Server Error");
    }
  });
  
  



/* Connecting Backend with ML model */

// Define the route to handle the prediction
app.post('/predict', (req, res) => {
    const cropDetails = req.body;
    const userValues = [cropDetails.N,cropDetails.P,cropDetails.K,cropDetails.pH,cropDetails.rainfall,cropDetails.temperature]


    // Spawn a Python child process
    // const pythonProcess = spawn('python', [__dirname+'/ML/modelRes.py', JSON.stringify(userValues)]); // For GausianNB
    const pythonProcess = spawn('python', [__dirname+'/ML/modelResXGB.py', JSON.stringify(userValues)]); // For xgboost

    // Collect data from the Python script
    let result = '';
    pythonProcess.stdout.on('data', (data) => {
      result += data;
    });
    // console.log("output: "+result);

    // Handle the end of the Python script execution
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        console.log(result.trim());
        res.render("crop",{prediction:result, userValues:userValues });
      } else {
        console.log("Error in Python script execution");
        res.status(500).send('Error in Python script execution');
      }
    });
  
});




app.post("/crop", (req,res)=>{
  res.render("crop",{prediction:" "});
})

app.post("/userManual", (req,res)=>{
    res.render("userManual");
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