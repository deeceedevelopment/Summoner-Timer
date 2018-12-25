var express = require("express");
var router = express.Router();

//Accept a summoner name in request, send active match details in response
//insert summoner name into request parameters in a GET request, or request body in a POST request
router.get("/activematch", (req, res, next) => {
  //const requestBody = req.body;
  //console.log(requestBody);
  res.send("Response from active match route.");
});

module.exports = router;
