const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require("./routes/userRoutes");
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const swaggerDocument = yaml.load('./docs/api.yaml');

// Start Express
const app = express();

// Dotenv config
require('dotenv').config();

app.use(express.json()); // Parse request body if's JSON
app.use(express.urlencoded({extended: true})); // Parse request body if's key=and&value=pairs
app.use("/api/user", userRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Assigning port
const port = 1337 || process.env.PORT;

// Database connection
mongoose.connect(process.env.MONGO_DB,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },
    () => console.log('connected to DB!')
);

// Express app listening on port
app.listen(port, () => console.log(`Express server is listening on PORT - ${port}`));