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
  var width = 100,
      height = 100,
      radius = Math.min(width, height) / 2;

  var color = d3.scale.ordinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  var arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

  var labelArc = d3.svg.arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);

  var pie = d3.layout.pie()
      .sort(null);
      //.value(function(d) { return d[state]; });

  var svg = d3.select("#tooltip_graphs").selectAll("svg")
    .data([
      pie.value(function(d) { return d["United States"]; })(race_data),
      pie.value(function(d) { return d[state]; })(race_data),
      pie.value(function(d) { return d["United States"]; })(age_data),
      pie.value(function(d) { return d[state]; })(age_data)
    ])
    .enter()
    .append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .each(function(d,i){
      var svg = d3.select(this)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


      var g = svg.selectAll(".arc")
        .data(d)
        .enter().append("g")
        .attr("class", "arc");


      g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.race ? d.data.race : d.data.age); });

      // g.append("text")
      //   .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
      //   .attr("dy", ".35em")
      //   .text(function(d) { return d.data.race ? d.data.race : d.data.age; });

  });



}
