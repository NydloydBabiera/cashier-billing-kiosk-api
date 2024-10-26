const express = require("express");

// Database
const dbConn = require("./data-access/dbConnection");
const models = require('./models/index')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET", "POST", "PUT", "DELETE");
  next();
});

app.use("/userInformation", require("./routes/userInformation"));

(async () => {
  try {
    //sync models
    await models.sync({ force: false });
    console.log(`Attempting to run server on port ${process.env.PORT}`);

    app.listen(process.env.PORT, () => {
      console.log(`Listening on port ${process.env.PORT}`);
    });
  } catch (error) {}
})();
