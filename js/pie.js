(function(){
  var width = 400,
      height = 400,
      radius = Math.min(width, height) / 2;

  var color = d3.scale.ordinal()
      .range(["#DB6919","#e9853e","#eea26c","#f3bf9a","#FBD5B9","#fbeade"]);

  var arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

  var labelArc = d3.svg.arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);

  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.deaths; });

  var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip1");


  var svg = d3.select("#causes").append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  d3.csv("data/cause_of_death.csv", type, function(error, data) {
    if (error) throw error;

    var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc")
        .call(d3.helper.tooltip(
         function(d, i){
           return getContent(d);
         }
         ));

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.cause); });


  });

  function getContent(d) {
    return "<p class='tooltipTitle'>" + d.data.cause + ": </p><p class='tooltipText'>" + d.data.deaths + " deaths</p>";
  }

  function type(d) {
    d.deaths = +d.deaths;
    return d;
  }
})();
