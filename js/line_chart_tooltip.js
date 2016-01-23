queue()
    .defer(d3.csv, "data/births_by_race.csv")
    .defer(d3.csv, "data/births_by_age.csv") // process
    .await(birth_loaded);

var race_data;
var age_data;

function birth_loaded(error, loaded_race_data, loaded_age_data){
  race_data = loaded_race_data;
  age_data = loaded_age_data;
}

function update_state_tooltip(state){
//
var fullwidth = 300,
   fullheight = 200;

// these are the margins around the graph. Axes labels go in margins.
var margin = {top: 20, right: 25, bottom: 20, left: 50};

var width = fullwidth - margin.left - margin.right,
  height = fullheight- margin.top - margin.bottom;

var widthScale = d3.scale.linear()
          .range([ 0, width]);

var heightScale = d3.scale.ordinal()
          .rangeRoundBands([ margin.top, height], 0.2);

var xAxis = d3.svg.axis()
        .scale(widthScale)
        .orient("bottom");

var yAxis = d3.svg.axis()
        .scale(heightScale)
        .orient("left")
        .innerTickSize([0]);


var svg = d3.select("#tooltip_graphs").selectAll("svg")
  .data([race_data,age_data])
  .enter()
  .append("svg:svg")
  .attr("width", fullwidth)
  .attr("height", fullheight)
  .append("g")
  .each(function(d,i){
    var svg = d3.select(this)
      .append("g");

      console.log(d3.max(d,function (d){
        return +d["United States"];})
      );
      widthScale.domain([0, 5 + d3.max(d,function (d){

        var USMax = +d["United States"];
        var stateMax = +d[state];
        return Math.max(USMax,stateMax);

      })]);

      // js map: will make a new array out of all the d.race ? d.race : d.age fields
      heightScale.domain(d.map(function(d) { return d.race ? d.race : d.age; } ));


      // Make the faint lines from y labels to highest dot

      var linesGrid = svg.selectAll("lines.grid")
        .data(d)
        .enter()
        .append("line");

      linesGrid.attr("class", "grid")
        .attr("x1", margin.left)
        .attr("y1", function(d) {
          return heightScale(d.race ? d.race : d.age) + heightScale.rangeBand()/2;
        })
        .attr("x2", function(d) {
          return margin.left + widthScale(+d["United States"]);

        })
        .attr("y2", function(d) {
          return heightScale(d.race ? d.race : d.age) + heightScale.rangeBand()/2;
        });

      // Make the dotted lines between the dots

      var linesBetween = svg.selectAll("lines.between")
        .data(d)
        .enter()
        .append("line");

      linesBetween.attr("class", "between")
        .attr("x1", function(d) {
          return margin.left + widthScale(+d[state]);
        })
        .attr("y1", function(d) {
          return heightScale(d.race ? d.race : d.age) + heightScale.rangeBand()/2;
        })
        .attr("x2", function(d) {
          return margin.left + widthScale(d["United States"]);
        })
        .attr("y2", function(d) {
          return heightScale(d.race ? d.race : d.age) + heightScale.rangeBand()/2;
        })
        .attr("stroke-dasharray", "5,5");


      // Make the dots for 1990

      var dotsState = svg.selectAll("circle.state")
          .data(d)
          .enter()
          .append("circle");

      dotsState
        .attr("class", "state")
        .attr("cx", function(d) {
          return margin.left + widthScale(+d[state]);
        })
        .attr("r", 4)
        .attr("cy", function(d) {
          return heightScale(d.race ? d.race : d.age) + heightScale.rangeBand()/2;
        })
        .append("title")
        .text(function(d) {
          return d.race ? d.race : d.age + " in: " + d[state];
        });

      // Make the dots for 2013

      var dotsUS = svg.selectAll("circle.US")
          .data(d)
          .enter()
          .append("circle");

      dotsUS
        .attr("class", "UnitedStates")
        .attr("cx", function(d) {
          return margin.left + widthScale(+d["United States"]);
        })
        .attr("r", 4)
        .attr("cy", function(d) {
          return heightScale(d.race ? d.race : d.age) + heightScale.rangeBand()/2;
        })
        .append("title")
        .text(function(d) {
          return d.race ? d.race : d.age + " in: " + d["United States"];
        });

        // add the axes

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + margin.left + "," + height + ")")
        .call(xAxis);

      svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis);

      svg.append("text")
        .attr("class", "xlabel")
        .attr("transform", "translate(" + (margin.left + width / 2) + " ," +
              (height + margin.bottom) + ")")
        .style("text-anchor", "middle")
        .attr("dy", "12")
        .text("Percent of Births");

      // Style one of the Y labels bold:

      // a hack that works if you can unravel the selections - to style "The World" bold in the axis label, which is the 8th element:
      var allYAxisLabels = d3.selectAll("g.y.axis g.tick text")[0]; // un-nest array
      d3.select(allYAxisLabels[5]).style("font-weight", "bold");
        // You could also use tick formatting to get a % sign on each axis tick

  });



}
