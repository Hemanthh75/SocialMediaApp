const express = require('express');
const app = express();
const PORT = 8800;
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const multer = require("multer");
const path = require("path")

dotenv.config();

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};


//Database Commection
mongoose.connect(process.env.MONGO_URL, connectionParams).then(() => {
    console.log("Connected to Database")
}).catch((e)=> {
    console.log("Error while connecting to DB:", e)
});

app.use("/images", express.static(path.join(__dirname + "/public/images")))


//MiddleWares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        const filename = req.body.name || Date.now() + '-' + file.originalname;
        cb(null, filename)
    }
});

const upload = multer({storage});
app.post("/api/upload", upload.single("file"), (req, res) => {
    try{
        return res.status(200).json("File uploaded successfully.")
    }catch(err) {
        console.log(err)
    }
})

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);



app.listen(PORT, () => {
    console.log("Backend server is running!")
})
