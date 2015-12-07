(function(){

var width = 900;
var height = 700;


var svg2 = d3.select('#map').append('svg')
    .attr('width', width)
    .attr('height', height);

var projection = d3.geo.albersUsa()
    .scale(900) // mess with this if you want
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var colorScale = d3.scale.linear().range(["#D4EEFF", "#0099FF"]).interpolate(d3.interpolateLab);

var countryById = d3.map();

var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip");

// we use queue because we have 2 data files to load.
queue()
    .defer(d3.json, "data/USA.json")
    .defer(d3.csv, "data/mortality.csv", typeAndSet) // process
    .await(loaded);

function typeAndSet(d) {
    d.mortality = +d.mortality;
    countryById.set(d.states, d);
    return d;
}

function getColor(d) {
    var dataRow = countryById.get(d.properties.name);
    if (dataRow) {
        console.log(dataRow);
        return colorScale(dataRow.mortality);
    } else {
        console.log("no dataRow", d);
        return "#ccc";
    }
}

function getContent(d) {
  var content;
  var dataRow = countryById.get(d.properties.name);
     if (dataRow) {
         console.log(dataRow);
         content = dataRow.states + ": " + dataRow.mortality;
     } else {
         console.log("no dataRow", d);
         content = d.properties.name + ": No data.";
     }
     window.setTimeout(function(){
       update_state_tooltip(d.properties.name)
     });
     return content + '<div id="tooltip_graphs"></div>';
}


function loaded(error, usa, mortality) {

    console.log(usa);
    console.log(mortality);

    colorScale.domain(d3.extent(mortality, function(d) {return d.mortality;}));

    var states = topojson.feature(usa, usa.objects.units).features;

    svg2.selectAll('path.states')
        .data(states)
        .enter()
        .append('path')
        .attr('class', 'states')
        .attr('d', path)
        .attr('fill', function(d,i) {
            console.log(d.properties.name);
            return getColor(d);
        })
        .call(d3.helper.tooltip(
         function(d, i){
           return getContent(d);
         }
         )); //tooltip based in an example from Roger Veciana: http://bl.ocks.org/rveciana/5181105


    var linear = colorScale;

    svg2.append("g")
      .attr("class", "legendLinear")
      .attr("transform", "translate(20,20)");

    var legendLinear = d3.legend.color()
      .shapeWidth(30)
      .orient('horizontal')
      .scale(linear);

    svg2.select(".legendLinear")
      .call(legendLinear);

}
})();
