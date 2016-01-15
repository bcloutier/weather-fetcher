var htmlToJson = require("html-to-json");

module.exports = function(app) {
    
    app.post('/weather', function(req, res) {
        htmlToJson.request(req.body.url, function() {
            return this.map('#observations_details td', function(val) { 
                return val.text().replace(/(\r\n|\n|\r|\t)/gm,"");;
            })
        }).done(function(result) {
            res.send(_tidy(result,12));
        }, function(err) {
            console.log(err)
        })
    })

    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname + 'public/index.html')); 
    });
};

function _tidy(data, size) {
    var ary = [];
    while (data.length) ary.push(data.splice(0, size))
    return ary; 
}

