(function ($, _, d3) {
    'use strict';

    angular
        .module('weather-fetcher', ['ui.bootstrap'])
        .factory('WeatherService', ['$http', function wunderground_historial($http) {
            var _types = ['Daily', 'Weekly', 'Monthly'];

            var ws = {
                constructURL: constructURL,
                getWeather: getWeather
            }

            return ws;

            function constructURL(airportCode, year, month, day, type, city, country) {
                return "http://www.wunderground.com/history/airport/" + airportCode + "/" + year +
                    "/" + month + "/" + day + "/" + type + "History.html?req_city=" + city +
                    "&req_statename=" + country;
            }

            function getWeather(url) {
                return $http.post('/weather', url).then(function (raw) {
                    return _.map(raw.data, _parse)
                });
            }

            function _parse(dRow) {
                return {
                    timestamp: dRow[0],
                    temperature: parseFloat(dRow[1]),
                    pressure: parseFloat(dRow[4]).toFixed(2),
                    humidity: parseInt(dRow[3])
                }
            }
        }])
        .factory('VisualizeService', function () {
            var units = { temperature: "F", pressure: "in", humidity: "%" }

            var vd = {
                lineChart: _lineChart
            }

            return vd;

            function _lineChart(data, parameter) {
                var margin = {left: 60, top: 50, right: 40, bottom: 60 },
                    width = 600 - margin.left - margin.right,
                    height = 270 - margin.top - margin.bottom;

                var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
                var y = d3.scale.linear().range([height, 0]);

                var xAxis = d3.svg.axis().scale(x)
                    .orient("bottom")
                    .ticks(5)

                var yAxis = d3.svg.axis().scale(y)
                    .orient("left")
                    .ticks(5)
                    .tickFormat(function (d) {
                        return d + ' ' + units[parameter]
                    })

                var line = d3.svg.line()
                    .x(function (d) {
                        return x(d.timestamp);
                    })
                    .y(function (d) {
                        return y(d[parameter]);
                    });

                var svg = d3.select("body")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                x.domain(data.map(function (d) {
                    return d.timestamp
                }));
                y.domain(d3.extent(data, function (d) {
                    return d[parameter];
                }));

                svg.append("path")
                    .attr("class", "line")
                    .attr("class", parameter)
                    .attr("d", line(data));

                svg.append("g") // Add the X Axis
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("transform", "rotate(-65)");

                svg.append("g") // Add the Y Axis
                    .attr("class", "y axis")
                    .attr("class", "y axis " + parameter)
                    .call(yAxis);

                svg.append("text")
                    .attr("x", (width / 2))
                    .attr("y", 0 - (margin.top / 2))
                    .attr("text-anchor", "middle")
                    .style("font-size", "16px")
                    .text(parameter.charAt(0).toUpperCase() + parameter.slice(1));


                return {
                    update: _update
                }

                function _update(data) {
                    x.domain(data.map(function (d) {
                        return d.timestamp
                    }));
                    y.domain(d3.extent(data, function (d) {
                        return d[parameter];
                    }));

                    var svg = d3.select("body").transition();
                    svg.select("." + parameter) // change the line
                        .duration(750)
                        .attr("d", line(data));
                    svg.select(".x axis") // change the x axis
                        .duration(750)
                        .call(xAxis)
                        .selectAll("text")
                        .style("text-anchor", "end")
                        .attr("dx", "-.8em")
                        .attr("dy", ".15em")
                        .attr("transform", "rotate(-65)");
                    svg.select(".y axis " + parameter) // change the y axis
                        .duration(750)
                        .call(yAxis);
                }
            }
        })
        .controller('MainController', ['WeatherService', '$http', 'VisualizeService', function (wunderground,
            $http, VisualizeService) {
            var vm = this,
                temperature,
                pressure,
                humidity;

            vm.format = 'MM/dd/yyyy';
            vm.date = new Date();
            vm.date.setFullYear(2011);
            vm.date.setDate(13);
            vm.date.setMonth(10);

            //initalize
            wunderground.getWeather({
                url: wunderground.constructURL('ETIH', vm.date.getFullYear(), vm.date.getMonth() + 1,
                    vm.date.getDate(), 'Daily', 'Hohenfels', 'Germany')
            }).then(function (data) {
                vm.data = data;
                temperature = VisualizeService.lineChart(data, "temperature") //, "pressure", "humidity");
                pressure = VisualizeService.lineChart(data, "pressure");
                humidity = VisualizeService.lineChart(data, "humidity");
            })

            vm.updateWeather = function () {
                vm.url = wunderground.constructURL('ETIH', vm.date.getFullYear(), vm.date.getMonth() + 1,
                    vm.date.getDate(), 'Daily', 'Hohenfels', 'Germany');
                wunderground.getWeather({
                    url: vm.url
                }).then(function (data) {
                    vm.data = data;
                    temperature.update(data);
                    pressure.update(data);
                    humidity.update(data);
                })

            }
        }])

})(jQuery, _, d3)