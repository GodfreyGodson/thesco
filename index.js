const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

dotenv.config();

//start listening to requests
app.listen(3000, function(){
    console.log('Server started at port 3000');
})


// Enable CORS for all routes
//app.use(cors());


app.use(cors({
    origin: '*', // set Access-Control-Allow-Origin to *
    methods: 'GET, POST, PUT, DELETE, OPTIONS', // set Access-Control-Allow-Methods to the allowed HTTP methods
    allowedHeaders: 'Content-Type, Authorization' // set Access-Control-Allow-Headers to the allowed headers
  }));
  

//connect to Database mongoose
mongoose.set('strictQuery', false);
 const connectToDb = async () => {
    try{
      const conn = await  mongoose.connect(process.env.MONGO_URL);
      console.log('DB connected')

    }catch(error){

        console.error(`Error connected to MongoDb: ${error.message}`);
        
       // process.exit(1) is used to stop the Node.js process when an error occurs. This is to prevent the application from continuing to run and potentially causing further issues. It is also a good practice to handle mongoose connection errors so that you can take necessary actions.
        process.exit(1);

    }

};
connectToDb();

 // res.status(400).send(error);
// mongoose.connect(process.env.MONGO_URL, function(){
//     console.log('Database Connected');
// })

app.use(express.json());
app.use("/uploads", express.static("uploads"));
//initiliaze Routes


app.use('/api', require('./routes/app'));
