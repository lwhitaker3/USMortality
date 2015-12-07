(function(){

var margin = {top: 10, right: 0, bottom: 20, left: 20},
    width = 200 - margin.left - margin.right,
    height = 90 - margin.top - margin.bottom;


var color = d3.scale.linear()
          .range(["#ca0020","#f4a582","#f7f7f7","#92c5de","#0571b0"])
          .domain([0,0.2,0.4,0.6,0.8]);

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

// Scales. Note the inverted domain fo y-scale: bigger is up!
var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>" + d.factor + "\t" + d.country + "</strong><br/><span style='color:#fff'>" + d.percent + "</span>";
  })

// csv loaded asynchronously
d3.csv("data/country_data_multiples.csv", type, function(data) {

  // Data is nested by factor
  var dataByFactors = d3.nest()
      .key(function(d) { return d.factor; })
      .entries(data);

  // Parse dates and numbers. We assume values are sorted by date.
  // Also compute the maximum price per symbol, needed for the y-domain.
  // symbols.forEach(function(s) {
  //   s.values.forEach(function(d) { d.date = parse(d.date); d.price = +d.price; });
  //   s.maxPrice = d3.max(s.values, function(d) { return d.price; });
  // });

  // Compute the minimum and maximum country and percent across symbols.
  x.domain(data.map(function(d) { return d.country; }));


  // Add an SVG element for each factor, with the desired dimensions and margin.
  var svg = d3.select("#small_multiples").selectAll("svg")
    .data(dataByFactors)
    .enter()
    .append("svg:svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .each(function(d,i){
      var svg = d3.select(this);

      console.log(d);
      y.domain([0, d3.max(d.values, function(s) { return s.percent;})]);

      svg.append("g")
          // Hide y axis
          // .attr("class", "y axis")
          // .call(yAxis)
        .append("text")
        .attr("x", width + 10)
        .attr("y", height+ 50)
        .attr("dy", ".71em")
        .attr("text-anchor", "start")
        .attr("font-size", "1.1em")
        .text(function(d) { return d.key});

      // Accessing nested data: https://groups.google.com/forum/#!topic/d3-js/kummm9mS4EA
      // data(function(d) {return d.values;})
      // this will dereference the values for nested data for each group
      svg.selectAll(".bar")
          .data(function(d) {return d.values;})
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.country); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.percent); })
          .attr("height", function(d) { return height - y(d.percent); })
          .attr("fill", function(d) {return color(d.percent)})
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide)

      svg.call(tip);

    });

  // svg.append("g")
  //     .attr("class", "x axis")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(xAxis);



});

function type(d) {
  d.percent = +d.percent;
  return d;
}

})();
