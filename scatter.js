var width1 = 700;
var height1 = 600;
var margin1 = {top: 20, right: 0, bottom: 50, left: 50};


var dotRadius = 5;

var xScale1 = d3.scale.linear()
  .range([ margin1.left, width1 - margin1.right - margin1.left ]);

var yScale1 = d3.scale.linear()
  .range([ height1 - margin1.bottom, margin1.top]);

var xAxis1 = d3.svg.axis()
  .scale(xScale1)
  .orient("bottom")
  .ticks(10);

var yAxis1 = d3.svg.axis()
  .scale(yScale1)
  .orient("left")
  .ticks(10);

var svg3 = d3.select("#scatter")
  .append("svg")
  .attr("width", width1)
  .attr("height", height1);

var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip1");

d3.csv("countrydata.csv", function(data) {

  xScale1.domain([
    d3.min(data, function(d) {
      return +d.imr;
    }) - 1,
    d3.max(data, function (d) {
      return +d.imr;
    }) + 2
  ]);

  yScale1.domain([
    d3.min(data, function(d) {
      return +d.preterm;
    }) - 5,
    d3.max(data, function (d) {
      return +d.preterm;
    }) + 2
  ]);

  var circles = svg3.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dots");

  circles.attr("cx", function(d) {
      return xScale1(+d.imr);
    })
    .attr("cy", function(d) {
      return yScale1(+d.preterm);
    })
    .attr("r", dotRadius)
    .attr("fill", function(d,i){
      if (d.country === 'World'){
        return "#FF0099";
      }else{
        return "#0099FF";
      }
    })
    .attr("opacity", .7);

    circles
      .on("mouseover", mouseoverFunc)
      .on("mousemove", mousemoveFunc)
      .on("mouseout", mouseoutFunc);


  svg3.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height1 - margin1.bottom) + ")")
    .call(xAxis1);

  svg3.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + (margin1.left) + ",0)")
    .call(yAxis1);

  svg3.append("text")
    .attr("class", "xlabel")
    .attr("transform", "translate(" + (width1 / 2) + " ," +
          (height1-20) + ")")
    .style("text-anchor", "middle")
    .attr("dy", "12")
    .text("Under 5 Mortality Rate");

  svg3.append("text")
    .attr("class", "ylabel")
    .attr("transform", "translate(" + margin1.right + " ," +
          (height1/2) + ")")
    .style("text-anchor", "middle")
    .attr("dx", "-300")
    .attr("dy", "12")
    .attr("transform", "rotate(-90)")
    .text("Percent of Births Registered");



});




function mouseoverFunc(d) {
  // console.log(d);
  return tooltip
    .style("display", null) // this removes the display none setting from it
    .html("<p>" + d.Country +
          "<br>Infant Mortality Rate: " + d.imr +
          "<br>Registered Births: " + d.preterm + "%</p>");
  }

function mousemoveFunc(d) {
  //console.log("events", window.event, d3.event);
  return tooltip
    .style("top", (d3.event.pageY - 10) + "px" )
    .style("left", (d3.event.pageX + 10) + "px");
}

function mouseoutFunc(d) {
  return tooltip.style("display", "none");  // this sets it to invisible!
}
