const express = require("express");
const cors = require("cors");
const app = express();

const whitelist = ['http://localhost:3000', 'https://localhost:3443',"https://3443naren-HP-Laptop-15-da0xxx:3001"];
var corsOptionsDelegate = (req,cb) => {
    var corsOptions;
    console.log(req.header("Origin"));
    if(whitelist.indexOf(req.header("Origin"))!==-1) {
        corsOptions = {origin : true};
    }
    else corsOptions = {origin : false};
    cb(null,corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);