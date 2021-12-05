// import { MongoClient } from '../crudnext/node_modules/mongodb/mongodb'

// const { authRouter } = require("./routes/authRoutes");
// const { profilesRouter } = require("./routes/profilesRoutes");
// const { usersRouter } = require("./routes/userRoutes");
// const { dashboardRouter } = require("./routes/dashboardRoutes");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const {authRouter} = require("./routes/authRoutes");

const app = express();
const port = 5000;
const MONGO_URI = "mongodb+srv://AdrianaYushchenko:1234567890@cluster0.g3ihl.mongodb.net/teachers?retryWrites=true&w=majority"

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRouter);

const start = async () => {
    try {
        await mongoose.connect(MONGO_URI);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

// {
//     useNewUrlParser: true,
//         useUnifiedTopology: true,
// }

start();

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});

module.exports = app;
