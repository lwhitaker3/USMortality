var width = 800;
var height = 600;
var margin = {top: 20, right: 100, bottom: 40, left:100};

var dateFormat = d3.time.format("%Y");

var xScale = d3.time.scale()
          .range([ margin.left, width - margin.right - margin.left ]);

var yScale = d3.scale.linear()
          .range([ margin.top, height - margin.bottom ]);

var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(10)
        .tickFormat(function(d) {
          return dateFormat(d);
        })
        .innerTickSize([5]);

var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .innerTickSize([5]);


var line = d3.svg.line()
  .x(function(d) {
    return xScale(dateFormat.parse(d.year));
  })
  .y(function(d) {
    return yScale(+d.amount);
  });


var svg1 = d3.select("#linechart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip1");


d3.csv("infant_mortality.csv", function(data) {

  var years = ["1950", "1951", "1952", "1953", "1954", "1955", "1956", "1957", "1958", "1959","1960", "1961", "1962", "1963", "1964", "1965", "1966", "1967", "1968", "1969","1970", "1971", "1972", "1973", "1974", "1975", "1976", "1977", "1978", "1979","1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989","1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013"];

  var dataset = [];

  data.forEach(function (d, i) {

    var nnmr = [];

    years.forEach(function (y) {

      if (d[y]) {
        nnmr.push({
          Country: d.Country,
          year: y,
          amount: d[y]
        });
      }

    });

    dataset.push( {
      Country: d.Country,
      mortality: nnmr
      } );

  });



  xScale.domain(
    d3.extent(years, function(d) {
      return dateFormat.parse(d);
    }));

  yScale.domain([
    d3.max(dataset, function(d) {
      return d3.max(d.mortality, function(d) {
        return +d.amount;
      }) + 4;
    }),
    0
  ]);


  var groups = svg1.selectAll("g.lines")
    .data(dataset)
    .enter()
    .append("g")


  groups.selectAll("path")
    .data(function(d) {
      return [ d.mortality ];
    })
    .enter()
    .append("path")
    .attr("class", "line")
    .attr("d", line)
    .attr("stroke", "#FF9900");

  var circles = groups.selectAll("circle")
            .data(function(d) { // because there's a group with data already...
                  return d.mortality; // NOT an array here.
            })
            .enter()
            .append("circle");

  circles.attr("cx", function(d) {
      return xScale(dateFormat.parse(d.year));
    })
    .attr("cy", function(d) {
      return yScale(d.amount);
    })
    .attr("r", 3)
    .style("opacity", 0);

  circles
    .on("mouseover", mouseoverFunc)
    .on("mousemove", mousemoveFunc)
    .on("mouseout",	mouseoutFunc);

  groups.append("text")
    .datum(function(d) {
      return {name: d.Country, value: d.mortality[d.mortality.length - 1]};
    })
    .attr("transform", function(d) {
      // error on some with no d.value - American Samoa, for instance.
      if (d.value) {
        return "translate(" + xScale(dateFormat.parse(d.value.year)) + "," + yScale(+d.value.amount) + ")";
        }
      else {
        return null;
        }
      })
    .attr("x", 3)
    .attr("dy", ".35em")
    .text(function(d) {
      if (d.value && +d.value.amount > 700000) {
      return d.name;
      }
    })
    .attr("class", "linelabel");


  svg1.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height - margin.bottom ) + ")")
    .call(xAxis);

  svg1.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(yAxis);


  svg1.append("text")
    .attr("transform", "translate(" + (width - margin.right - margin.left + 5) + "," + yScale(dataset[187].mortality[63].amount) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .attr("class", "labels")
    .text("United States");

  svg1.append("text")
    .attr("class", "ylabel")
    .attr("transform", "translate(" + (width - margin.right) + " ," + (height/2) + ")")
    .style("text-anchor", "middle")
    .attr("dx", "-300")
    .attr("dy", "60")
    .attr("transform", "rotate(-90)")
    .text("Neonatal Mortality Rate");






  d3.selectAll("g.lines")
    .on("mouseover", mouseoverFunc)
    .on("mouseout", mouseoutFunc)
    .on("mousemove", mousemoveFunc);



function mouseoverFunc(d) {
  d3.select(this)
    .transition()
    .style("opacity", 1)
    .attr("r", 4);
  tooltip
    .style("display", null) // this removes the display none setting from it
    .html("<p><span class='Country'>" + d.Country + "</span>" +
          "<br><strong>Year: </strong>" + d.year +
          "<br><strong>Mortality Rate: </strong>" + d.amount + "</p>");
  }

function mousemoveFunc(d) {
  tooltip
    .style("top", (d3.event.pageY - 10) + "px" )
    .style("left", (d3.event.pageX + 10) + "px");
  }

function mouseoutFunc(d) {
  d3.select(this)
    .transition()
    .style("opacity", 0)
    .attr("r", 3);
  tooltip.style("display", "none");  // this sets it to invisible!
}

});
