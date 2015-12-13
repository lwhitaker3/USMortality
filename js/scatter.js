(function(){

  var prettyNames = {
    imr: "Infant Mortality",
    preterm: "Preterm Birth Rate",
    GINI: "GINI Index",
    adolescent: "Adolescent Birth Rate",
    obesity: "Obesity Prevelance",
    healthcare: "Healthcare Expenditures",
    mmr: "Maternal Mortality Rate",
  };

  var factor;
  var value;

  var width1 = 982;
  var height1 = 500;
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
              selected = "preterm"
              draw(data, selected);
              var thisButton = d3.select(this);
              d3.selectAll("button").classed("selected", false);
              thisButton.classed("selected", true);
          });
      d3.select("#data2")
          .on("click", function(d,i) {
              selected = "GINI"
              draw(data, selected);
              var thisButton = d3.select(this);
              d3.selectAll("button").classed("selected", false);
              thisButton.classed("selected", true);
          });
      d3.select("#data3")
          .on("click", function(d,i) {
              selected = "healthcare"
              draw(data, selected);
              var thisButton = d3.select(this);
              d3.selectAll("button").classed("selected", false);
              thisButton.classed("selected", true);
          });
      d3.select("#data4")
          .on("click", function(d,i) {
              selected = "adolescent"
              draw(data, selected);
              var thisButton = d3.select(this);
              d3.selectAll("button").classed("selected", false);
              thisButton.classed("selected", true);
          });
      d3.select("#data5")
          .on("click", function(d,i) {
              selected = "obesity"
              draw(data, selected);
              var thisButton = d3.select(this);
              d3.selectAll("button").classed("selected", false);
              thisButton.classed("selected", true);
          });
      d3.select("#data6")
          .on("click", function(d,i) {
              selected = "mmr"
              draw(data, selected);
              var thisButton = d3.select(this);
              d3.selectAll("button").classed("selected", false);
              thisButton.classed("selected", true);
          });


    svg3.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height1 - margin1.bottom) + ")")
      .call(xAxis1)
      .append("text")
      .attr("x", width1 - margin1.left - margin1.right)
      .attr("y", margin1.bottom / 3)
      .attr("dy", "1em")
      .style("text-anchor", "end")
      .attr("class", "label")
      .text("Infant Mortality Rate");

    svg3.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + (margin1.left) + ",0)")
      .call(yAxis1);

    queue()
      .defer(d3.csv, "data/countrydata.csv")
      .await(load);

    var data = [];
    var selected = "preterm";

    function load(error, dataset) {
    if (error) {
      console.log(error);
    } else {
      //console.log(data1);
      data = dataset;

      draw(data, selected);
    }
    }
    // This function is used to draw and update the data. It takes different data each time.

    function draw(data, selected) {

      //console.log(data);
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
          return +d[selected];
        }) - 2,
        d3.max(data, function (d) {
          return +d[selected];
        }) + 2
      ]);


      // data join
      var circles = svg3.selectAll("circle")
          .data(data, function(d) {return d.country;}); // key function!


      // enter and create new ones if needed
      circles
        .enter()
        .append("circle")
        .attr("class", "dots");

        circles
          .on("mouseover", mouseoverFunc)
          .on("mousemove", mousemoveFunc)
          .on("mouseout", mouseoutFunc);


      circles
        .transition()
        .duration(2000)
        .attr("cx", function(d) {
          return xScale1(+d.imr);
        })
        .attr("cy", function(d) {
          return yScale1(+d[selected]);
        })
        .attr("r", function() {
            return dotRadius;
        })
        .attr("class", function(d,i){
          var replacedStrings = d.country.replace(" ","_");
          if (d.country === 'United States'){
            return replacedStrings + " usFocus dots";
          }else{
            return replacedStrings + " dots";
          }
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
    //console.log(d);

    var replacedStrings = d.country.replace(" ","_");
    d3.selectAll(".wrapperScatterMultiples ." + replacedStrings).classed("hoverFocus",true);
    return tooltip
      .style("display", null) // this removes the display none setting from it
      .html("<p><span class='tooltipTitle'>" + d.country +
            "</span><span class='tooltipText'><br>Infant Mortality Rate: " + d.imr +
            "<br>" + prettyNames[selected] + ": " + d[selected]
              + "</span></p>");
    }

  function mousemoveFunc(d) {
    //console.log("events", window.event, d3.event);
    return tooltip
      .style("top", (d3.event.pageY - 10) + "px" )
      .style("left", (d3.event.pageX + 10) + "px");
  }

  function mouseoutFunc(d) {

    var replacedStrings = d.country.replace(" ","_");
    d3.selectAll(".wrapperScatterMultiples ." + replacedStrings).classed("hoverFocus",false);

    return tooltip.style("display", "none");  // this sets it to invisible!
  }

})();
