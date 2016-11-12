/**
 * Created by JohnWu on 2016-11-11.
 */
// application -------------------------------------------------------------

var request = require('request');

module.exports = function (app) {

    app.post('/api/kairos', function(req, res) {
        request({
            method: 'POST',
            url: 'https://api.kairos.com/v2/media?source=http%3A%2F%2Fmedia.kairos.com%2Ftest.flv',
            timeout: '10',
            headers: {
                'app_id': 'bc0b9fcd',
                'app_key': '0ae50b89bb2c96c6fd7a2c8df8e89135'
            }}, function (error, response, body) {
            console.log('Status:', response.statusCode);
            console.log('Headers:', JSON.stringify(response.headers));
            console.log('Response:', body);
            res.json(body);
        });
    });

    app.get('/api/kairos/:media_id', function(req,res) {
        request({
            method: 'GET',
            url: 'https://api.kairos.com/v2/media/' + req.params.media_id,
            headers: {
                'app_id': 'bc0b9fcd',
                'app_key': '0ae50b89bb2c96c6fd7a2c8df8e89135'
            }}, function (error, response, body) {
            console.log('Status:', response.statusCode);
            console.log('Headers:', JSON.stringify(response.headers));
            console.log('Response:', body);
            res.json(body);
        });
    });

    app.delete('/api/kairos/:media_id', function(req,res) {
        request({
            method: 'DELETE',
            url: 'https://api.kairos.com/v2/media/' + req.params.media_id,
            headers: {
                'app_id': 'bc0b9fcd',
                'app_key': '0ae50b89bb2c96c6fd7a2c8df8e89135'
            }}, function (error, response, body) {
            console.log('Status:', response.statusCode);
            console.log('Headers:', JSON.stringify(response.headers));
            console.log('Response:', body);
            res.json(body);
        });
    });

    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/api.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
}