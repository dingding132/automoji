/**
 * Created by JohnWu on 2016-11-11.
 */
// application -------------------------------------------------------------

module.exports = function (app) {
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
}