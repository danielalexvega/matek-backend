const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const problemsRoutes = require("./routes/problems-routes");
const userRoutes = require("./routes/users-routes");
const courseRoutes = require("./routes/courses-routes");
const contentDomainRoutes = require("./routes/content-domain-routes");
const HttpError = require("./models/http-error");
const { getFileStream } = require("./s3");
require("dotenv").config();

const app = express();

app.use(bodyParser.json());

// app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.get("/images/:key", (req, res) => {
    const key = req.params.key;
    const readStream = getFileStream(key);

    readStream.pipe(res);
});

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
});

app.use("/api/problems", problemsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/contentDomains", contentDomainRoutes);

app.use((req, res, next) => {
    const error = new HttpError("Could not find this route.", 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            console.log(err);
        });
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occured." });
});

mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}.bpmz7.mongodb.net/${process.env.DB_HOST}?retryWrites=true&w=majority`
    )
    .then(() => {
        app.listen(process.env.PORT || 5000);
    })
    .catch((err) => {
        console.log(err);
    });
