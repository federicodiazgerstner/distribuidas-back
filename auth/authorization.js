var jwt = require('jsonwebtoken');
const Refresh = require('./Refresh');
var config = require('../config').config();

var authorization = function (req, res, next) {
    try{
        var token = req.headers['x-access-token'];
        console.log("token",token)
        var msg = {auth: false, message: 'No token provided.'};
        if (!token)
            res.status(500).send(msg);

        let sec = process.env.SECRET;
        //console.log("secret",sec)
        jwt.verify(token, sec, async function (err, decoded) {
            var msg = {auth: false, message: 'Failed to authenticate token.'};
            if (err){
                console.log("error1")
                var response = await Refresh(req, res, next)
                console.log("response",response)
                if(response.auth){
                    next();
                }else{
                    console.log("error2")
                    res.status(500).send(msg);
                }
            }else{
                next();
            }
        });
    }catch(e){
        res.status(500).send({auth: false, message: 'Failed to authenticate token.'});
    }
}

module.exports = authorization;

