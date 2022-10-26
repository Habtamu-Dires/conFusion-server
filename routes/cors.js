const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:3000', 'https://localhost:3443', 'http://now:3001', 'http://localhost:3001',
                    'http://localhost:3002'];

var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = {origin: true}; // allow it
    } else {
        corsOptions = { origin: false} ;
    }
    callback(null, corsOptions);
};

exports.cors = cors(); //allow it for all.
exports.corsWithOptions = cors(corsOptionsDelegate); //for specific options