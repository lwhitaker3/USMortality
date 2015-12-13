(function(){

var margin = {top: 10, right: 20, bottom: 20, left: 20},
    width = 330 - margin.left - margin.right,
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
    return d.state + "<br/><span class='tooltipText'>" + d.number + "</span>";
  })

// csv loaded asynchronously
d3.csv("data/state_data.csv", type, function(data) {

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

  // Compute the minimum and maximum state and number across symbols.


  // Add an SVG element for each factor, with the desired dimensions and margin.
  var svg = d3.select("#state_data").selectAll("svg")
    .data(dataByFactors)
    .enter()
    .append("svg:svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .each(function(d,i){

      d.values.sort(function(a, b) {
        //console.log(d.values)
        //console.log(a.percent,b.percent);

        //console.log(a.number);
        return d3.ascending(a.number, b.number);
      });

      var svg = d3.select(this);



      //console.log(d);


      y.domain([0, d3.max(d.values, function(s) { return s.number;})]);
      x.domain(d.values.map(function(d) { return d.state; }));

      svg.append("g")
          .attr("class", "y axis")
            // .call(yAxis)
          .append("text")
          .attr("x", 10)
          .attr("y", height+2)
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
          .attr("class", function(d){
            var replacedStrings = d.state.replace(" ","_");
            return "bar " + replacedStrings;
          })
          .attr("x", function(d) { return x(d.state); })
          .attr("width", x.rangeBand()-1)
          .attr("y", function(d) {
            var yCoordinate = y(d.number);
            if(isNaN(yCoordinate)){
              return 0;
            }else{
              return yCoordinate;
            }
          })
          .attr("height", function(d) {
            var yCoordinate = y(d.number);
            if(isNaN(yCoordinate)){
              return 0;
            }else{
              return height - yCoordinate;
            }
          })
          .attr("fill", function(d) {return color(d.number)})
          .on('mouseout', function(d){
            tip.hide(d);
            var replacedStrings = d.state.replace(" ","_");
            d3.selectAll(".wrapperMapMultiples ." + replacedStrings).classed("hoverFocus",false);
          })
          .on('mouseover', function(d){
            tip.show(d);
            var replacedStrings = d.state.replace(" ","_");
            d3.selectAll(".wrapperMapMultiples ." + replacedStrings).classed("hoverFocus",true);
          });

      svg.call(tip);

    });

  // svg.append("g")
  //     .attr("class", "x axis")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(xAxis);



});

function type(d) {
  d.number = +d.number;
  return d;
}

})();
