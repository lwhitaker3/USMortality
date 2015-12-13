(function(){

var margin = {top: 20, right: 10, bottom: 40, left: 40},
    width = 300 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

var svg = d3.select("#imrrace").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/race_imr.csv", type, function(error, data) {
  if (error) throw error;

  x.domain(data.map(function(d) { return d.race; }));
  y.domain([0, d3.max(data, function(d) { return d.imr; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
        .attr("dy", ".5em")
        .attr("transform", "rotate(-30)")
        .style("text-anchor", "end");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("dy", -30)
      .style("text-anchor", "end")
      .text("Infant Mortality");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.race); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.imr); })
      .attr("height", function(d) { return height - y(d.imr); });
});

function type(d) {
  d.imr = +d.imr;
  return d;
}
})();
