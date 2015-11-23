var width1 = 700;
var height1 = 400;
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

  d3.select("button#data1").classed("selected", true);

    d3.select("#data1")
        .on("click", function(d,i) {
            selected = "first"
            draw(data, selected);
            var thisButton = d3.select(this);
            d3.selectAll("button").classed("selected", false);
            thisButton.classed("selected", true);
        });
    d3.select("#data2")
        .on("click", function(d,i) {
            selected = "second"
            draw(data, selected);
            var thisButton = d3.select(this);
            d3.selectAll("button").classed("selected", false);
            thisButton.classed("selected", true);
        });
    d3.select("#data3")
        .on("click", function(d,i) {
            selected = "third"
            draw(data, selected);
            var thisButton = d3.select(this);
            d3.selectAll("button").classed("selected", false);
            thisButton.classed("selected", true);
        });
    d3.select("#data4")
        .on("click", function(d,i) {
            selected = "fourth"
            draw(data, selected);
            var thisButton = d3.select(this);
            d3.selectAll("button").classed("selected", false);
            thisButton.classed("selected", true);
        });

  svg3.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height1 - margin1.bottom) + ")")
    .call(xAxis1);

  svg3.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + (margin1.left) + ",0)")
    .call(yAxis1);

  queue()
    .defer(d3.csv, "country_data.csv")
    .await(load);

  var data = [];
  var selected = "first";

  function load(error, dataset) {
  if (error) {
    console.log(error);
  } else {
    console.log(data1);
    data = dataset;

    draw(data, selected);
  }
  }
  // This function is used to draw and update the data. It takes different data each time.

  function draw(data, selected) {

    console.log(data);
    xScale1.domain([
      d3.min(data, function(d) {
        return +d.imr;
      }) - 2,
      d3.max(data, function (d) {
        return +d.imr;
      }) + 2
    ]);

    yScale1.domain([
      d3.min(data, function(d) {
        if (selected == "first"){
          return +d.preterm;
        }else if (selected == "second"){
          return +d.GINI;
        }else if (selected == "third"){
          return +d.health;
        }else if (selected == "fourth"){
          return +d.adolecent;
        }
      }) - 2,
      d3.max(data, function (d) {
        if (selected == "first"){
          return +d.preterm;
        }else if (selected == "second"){
          return +d.GINI;
        }else if (selected == "third"){
          return +d.health;
        }else if (selected == "fourth"){
          return +d.adolecent;
        }
      }) + 2
    ]);


    // data join
    var circles = svg3.selectAll("circle")
        .data(data, function(d) {return d.country;}); // key function!


    // enter and create new ones if needed
    circles
      .enter()
      .append("circle")
      .attr("class", "dots")
      .append("title")
      .text(function(d){
          return d.country
      });


    circles
      .transition()
      .duration(2000)
      .attr("cx", function(d) {
        return xScale1(+d.imr);
      })
      .attr("cy", function(d) {
        if (selected == "first"){
          return yScale1(+d.preterm);
        }else if (selected == "second"){
          return yScale1(+d.GINI);
        }else if (selected == "third"){
          return yScale1(+d.health);
        }else if (selected == "fourth"){
          return yScale1(+d.adolecent);
        }
      })
      .attr("r", function() {
          return dotRadius;
      });


      // fade out the ones that aren't in the current data set
    circles
      .exit()
      .transition()
      .duration(1000)
      .style("opacity", 0)
      .remove();

      // Update the axes - also animated. this is really easy.
     svg3.select(".x.axis")
        .transition()
        .duration(1000)
        .call(xAxis1);

      // Update Y Axis
      svg3.select(".y.axis")
          .transition()
          .duration(1000)
          .call(yAxis1);



  };




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
