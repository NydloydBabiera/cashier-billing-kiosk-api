const express = require("express");
const cors = require('cors');
// Database
const dbConn = require("./data-access/dbConnection");
const models = require('./models/index')
const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*' // Allow only requests from this origin
}));


app.use("/userInformation", require("./routes/userInformation"));
app.use("/tuition", require("./routes/tuitionInformation"));
app.use("/transactions", require("./routes/transactionInformation"));

  
(async () => {
  try {
    //sync models
    await dbConn.sync({ alter: true });
    console.log(`Attempting to run server on port ${process.env.PORT}`);

    app.listen(process.env.PORT, () => {
      console.log(`Listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error)
  }
})();
