(function(){


// setup the vis - borrowed and adapted from Halina's code

    var margin = {
    top: 50,
    right: 40,
    bottom: 70,
    left: 40
    };

    var width = 1024;
    var height = 600;


    //Set up date formatting and years
    var dateFormat = d3.time.format("%Y");

    //Set up scales
    var xScale = d3.time.scale()
    .range([margin.left, width - margin.right - margin.left]);

    var yScale = d3.scale.sqrt()
    .range([margin.top, height - margin.bottom]);

    //Configure axis generators
    var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(9)
    .tickFormat(function (d) {
        return dateFormat(d);
    })
    .innerTickSize(0);

    var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .innerTickSize(0);

    //Configure line generator
    // each line dataset must have a d.year and a d.rate for this to work.
    var line = d3.svg.line()
      .x(function (d) {
          return xScale(dateFormat.parse(d.year));
      })
      .y(function (d) {
          return yScale(+d.rate);
      });



    //Create the empty SVG image
    var svg = d3.select("#vis1")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(xAxis)
        .append("text")
        .attr("x", width - margin.left - margin.right)
        .attr("y", margin.bottom / 3)
        .attr("dy", "1em")
        .style("text-anchor", "end")
        .attr("class", "label")
        .text("Year");

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -margin.top)
        .attr("y", -2*margin.left/2)
        .attr("dy", "1em")
        .style("text-anchor", "end")
        .attr("class", "label")
        .text("Infant Mortality Rate");




function draw_lines(data) {

    var years = d3.keys(data[0]).slice(1, 65); //
    //console.log(years);

    //Create a new, empty array to hold our restructured dataset
    var dataset = [];

    //Loop once for each row in data
    data.forEach(function (d, i) {

        var IMRs = [];

        years.forEach(function (y) { //Loop through all the years - and get the rates for this data element

            if (d[y]) { /// What we are checking is if the "y" value - the year string from our array, which would translate to a column in our csv file - is empty or not.

                IMRs.push({ //Add a new object to the new rates data array - for year, rate. These are OBJECTS that we are pushing onto the array
                    year: y,
                    rate: d[y], // this is the value for, for example, d["2004"]
                    Country: d.Country
                });
            }

        });
        dataset.push({ // At this point we are accessing one index of data from our original csv "data", above and we have created an array of year and rate data from this index. We then create a new object with the Country value from this index and the array that we have made from this index.
            country: d.Country,
            rates: IMRs // we just built this from the current index.
        });

    });

    //Uncomment to log the original data to the console
    //console.log(data);

    //Uncomment to log the newly restructured dataset to the console
    //console.log(dataset);


    //Set scale domains - max and min of the years
    xScale.domain(
        d3.extent(years, function (d) {
            return dateFormat.parse(d);
        }));

    // max of rates to 0 (reversed, remember)
    yScale.domain([
        d3.max(dataset, function (d) {
            return d3.max(d.rates, function (d) {
                return +d.rate;
            });
        }),
        0
    ]);





    //Make a group for each country
    var groups = svg.selectAll("g.lines")
        .data(dataset, function(d) {return d.country});

    groups
      .enter()
      .append("g")
      .attr("class", "lines")
      .attr("id", function (d) {
          return d.country.replace(/\s/g, '_');
      });

    var paths = groups.selectAll("path")
      .data(function (d) { // because there's a group with data already...
          return [d.rates]; // it has to be an array for the line function
      });
      //Within each group, create a new line/path,
      //binding just the rates data to each one

    paths
      .enter()
      .append("path")
      .attr("class", "line")
      .classed("normal", true)
      .classed("focused", false); // gives gray color

    paths
      .transition()
      .duration(1000)
      .attr("d", line);

    groups
      .exit()
      .transition()
      .duration(1000)
      .style("opacity", 0)
      .remove();

    paths
      .exit()
      .transition()
      .duration(1000)
      .style("opacity", 0)
      .remove();



    /*======================================================================
      Adding the Axes
    ======================================================================*/



        // Update the axes - also animated. this is really easy.
   svg.select(".x.axis")
      .transition()
      .duration(1000)
      .call(xAxis);

    // Update Y Axis
    svg.select(".y.axis")
        .transition()
        .duration(1000)
        .call(yAxis);

}

// Settings object

// For use with scroller_template.html and mfreeman_scroller.js.


// function to move a selection to the front/top, from
// https://gist.github.com/trtg/3922684
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

var settings = {
  // could be used to save settings for styling things.
}

function focus_country(country) {
  //console.log("in focus", country);
  // unfocus all, then focus one if given a name.
    d3.selectAll("path.line").classed("focused", false);
    if (country) {
      var country = country.replace(/\s/g, '_');
      var line = d3.select("g.lines#" + country + " path.line");
      line.classed("focused", true);
      var lineGroup = d3.select("g.lines#" + country);
      lineGroup.moveToFront();
    }
}

// ******* Change the onX and onY function for some cases ********
var update = function(value) {
  //console.log("UPDATE VALUE: " + value);
  var country = null;
  switch(value) {
    case 0:
      //console.log("in case", value);
      draw_lines(data1);
      country = null;
      break;
    case 1:
      //console.log("in case 2");
      country = "United States";
      draw_lines(data1);
      break;
    case 2:
      //console.log("in case 3");
      country = "United States";
      draw_lines(data2);
      break;
    default:
      country = null;
      break;
  }
  focus_country(country);// this applies a highlight on a country.
}
// setup scroll functionality

var data1 = []; // make this global
var data2 = []; // make this global

function load(error, dataset, dataset2) {
  if (error) {
    console.log(error);
  } else {
    //console.log(data1);
    data1 = dataset;
    data2 = dataset2; // assign to global




    var scroll = scroller()
      .container(d3.select('#graphic'));

    // pass in .step selection as the steps
    scroll(d3.selectAll('.step'));

    // Pass the update function to the scroll object
    //console.log(update);
    scroll.update(update);
  }
}

window.addEventListener("scroll", handleScroll);

function handleScroll(){
  var container = document.getElementById ("graphic");
  var graph = document.getElementById ("vis1");
  var containerRect = container.getBoundingClientRect();
  var graphRect = graph.getBoundingClientRect();
  var graphHeight = graphRect.bottom - graphRect.top;
  ////console.log(containerRect.bottom, graphHeight)
  if (containerRect.top > 0){
    //above
    $("#vis1").css({
      "position":"absolute",
      "top":"0",
      "bottom":"auto"
    });
  } else if(containerRect.bottom > graphHeight){
    $("#vis1").css({
      "position":"fixed",
      "top":"0",
      "bottom":"auto"
    });
  } else{
    $("#vis1").css({
      "position":"absolute",
      "top":"auto",
      "bottom":"0"
    });
  }
}

queue()
  .defer(d3.csv, "data/infant_mortality.csv")
  .defer(d3.csv, "data/infant_mortality_zoomed.csv")
  .await(load);
})();
