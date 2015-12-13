(function(){

var width = 700;
var height = 500;


var svg2 = d3.select('#map').append('svg')
    .attr('width', width)
    .attr('height', height);

var projection = d3.geo.albersUsa()
    .scale(950) // mess with this if you want
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var colorScale = d3.scale.linear().range(["#fbeade", "#DB6919"]).interpolate(d3.interpolateLab);

var countryById = d3.map();

var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip1");

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
        //console.log(dataRow);
        return colorScale(dataRow.mortality);
    } else {
        //console.log("no dataRow", d);
        return "#ccc";
    }
}

function getContent(d) {
  var content;
  var dataRow = countryById.get(d.properties.name);
     if (dataRow) {
         //console.log(dataRow);
         content = "<p class='tooltipTitle'>" + dataRow.states + ": </p><p class='tooltipText'>" + dataRow.mortality + "</p>";
     } else {
         //console.log("no dataRow", d);
         content = d.properties.name + ": No data.";
     }
     window.setTimeout(function(){
       update_state_tooltip(d.properties.name)
     });
     return content + '<div id="tooltip_graphs"></div>';
}


function loaded(error, usa, mortality) {

    //console.log(usa);
    //console.log(mortality);

    colorScale.domain(d3.extent(mortality, function(d) {return d.mortality;}));

    var states = topojson.feature(usa, usa.objects.units).features;

    svg2.selectAll('path.states')
        .data(states)
        .enter()
        .append('path')
        .attr("class", function(d){

          var replacedStrings = d.properties.name.replace(" ","_");
          console.log(replacedStrings);
          return "states " + replacedStrings;
        })
        .attr('d', path)
        .attr('fill', function(d,i) {
            //console.log(d.properties.name);
            return getColor(d);
        })
        .on('mouseout.focus', function(d){
          var replacedStrings = d.properties.name.replace(" ","_");
          d3.selectAll(".wrapperMapMultiples ." + replacedStrings).classed("hoverFocus",false);
        })
        .on('mouseover.focus', function(d){
          var replacedStrings = d.properties.name.replace(" ","_");
          d3.selectAll(".wrapperMapMultiples ." + replacedStrings).classed("hoverFocus",true);
        })
        .call(d3.helper.tooltip(
         function(d, i){
           return getContent(d);
         }
         )); //tooltip based in an example from Roger Veciana: http://bl.ocks.org/rveciana/5181105


    var linear = colorScale;

    svg2.append("g")
      .attr("class", "legendLinear")
      .attr("transform", "translate(0,0)");

    var legendLinear = d3.legend.color()
      .shapeWidth(30)
      .orient('horizontal')
      .scale(linear);

    svg2.select(".legendLinear")
      .call(legendLinear);

}
})();
