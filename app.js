const express = require("express");
const bodyParser = require("body-parser");

const problemsRoutes = require("./routes/problems-routes");

const app = express();

app.use(problemsRoutes);


app.listen(5000);