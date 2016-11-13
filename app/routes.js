/**
 * Created by JohnWu on 2016-11-11.
 */
// application -------------------------------------------------------------

var request = require('request');
var Message = require('./models/message');

module.exports = function (app) {

    // KAIROS API ================================================================================

    app.post('/api/kairos', function(req, res) {
        request({
            method: 'POST',
            //url: 'https://api.kairos.com/v2/media?source=http%3A%2F%2Fmedia.kairos.com%2Ftest.flv',
            url: 'https://api.kairos.com/v2/media?source=http%3A%2F%2Fwww.dropbox.com%2Fs%2F8ajkkf1agoowf11%2Ftest.flv%3Fdl%3D1',
            timeout: '10',
            headers: {
                'app_id': '01675658',
                'app_key': '7058d1fd90eb1e88925a4acb4b3ea67d'
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
                'app_id': '01675658',
                'app_key': '7058d1fd90eb1e88925a4acb4b3ea67d'
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
                'app_id': '01675658',
                'app_key': '7058d1fd90eb1e88925a4acb4b3ea67d'
            }}, function (error, response, body) {
            console.log('Status:', response.statusCode);
            console.log('Headers:', JSON.stringify(response.headers));
            console.log('Response:', body);
            res.json(body);
        });
    });

    // MESSAGES API ================================================================================

    app.get('/api/messages', function (req, res) {
        Message.find(function (err, messages) {
            if (err) {
                res.send(err);
            }
            res.json(messages);
        });
    });

    app.post('/api/messages', function (req, res) {
        Message.create({
            author: req.body.author,
            text: req.body.text,
            emoji:req.body.emoji,
            done: false
        }, function (err) {
            if (err)
                res.send(err);
            Message.find(function (err, messages) {
                if (err) {
                    res.send(err);
                }
                res.json(messages);
            });
        });
    });

    app.delete('/api/messages/:message_id', function (req, res) {
        Message.remove({
            _id: req.params.message_id
        }, function (err) {
            if (err)
                res.send(err);
            Message.find(function (err, messages) {
                if (err) {
                    res.send(err);
                }
                res.json(messages);
            });
        });
    });

    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
}
