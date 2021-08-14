const express = require("express");
const router = require("./routes/web.route");
const cors = require("cors");
require("./db/mongoose.js");


const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

//Initalize express
const app = express();

//Body Parser
app.use(express.json());


// Enabled all cors request
app.use(cors());

//Integrating swagger for Api calls
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument,{explorer:true}));
app.use("/api", router);

app.listen(3001, () => {
  console.log("The server is running at port 3001");
});
