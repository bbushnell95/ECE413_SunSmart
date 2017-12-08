var express = require('express');
var router = express.Router();
var request = require('request');

var api = '650be0fa52504acebc8d6656733d6b3a';

router.get('/uvforecast/:zip', function(req, res){
    var zip =req.params.zip;

    request({
        method: 'GET',
        uri: "https://api.weatherbit.io/v2.0/forecast/daily",
        qs: {
            postal_code: zip,
            days:5,
            key: api
        }
    }, function(error, response, body){
        var data = JSON.parse(body);
        var uv_list = [];
        uvs = data['data'];
        for(i = 0; i < 5; i++){
            uv_list.push(uvs[i].uv);
        }
        res.status(200).send(JSON.stringify(uv_list));

    });
});

module.exports = router;