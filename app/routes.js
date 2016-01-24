var htmlToJson = require("html-to-json");

module.exports = function(app) {
    app.post('/weather', function(req, res) {
        htmlToJson.request(req.body.url, function() {
            return this.map('#observations_details tr td', function(val) { 
                return val.text().replace(/(\r\n|\n|\r|\t)/gm,"");;
            })
        }).done(function(result) {
            res.send(_tidy(result,13));
        }, function(err) {
            console.log(err)
        })
    })
};

function _tidy(data, size) {
    var ary = [];
    while (data.length) ary.push(data.splice(0, size))
    return ary; 
}

