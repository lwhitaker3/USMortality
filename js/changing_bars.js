(function(){

    var width = 400;
    var height = 500;


        //setup the svg

        var vis = d3.select("#changing_bars").append("svg");
        var svg = vis
            .attr("width", width+100)
            .attr("height", height+100); // adding some random padding
        svg.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "none");

        d3.csv("data/imr_high_income.csv", function(error, data) {

            var column = d3.select("#menu select").property("value");
            var dataset = top20_by_column(data, column); // you need to finish this function below.

            console.log(column, dataset);

            redraw(dataset, column);

            //setup our ui -- requires access to data variable, so inside csv
            d3.select("#menu select")
                .on("change", function() {
                    column = d3.select("#menu select").property("value");
                    dataset = top20_by_column(data, column);
                    console.log(column, dataset);
                    redraw(dataset, column);
            });

        }) // end csv

        //make the bars for the first data set.  They will be red at first.

    function top20_by_column(data, column) {

      return data.sort(function(a, b) {
        return b[column] - a[column]; // descending order, biggest at the top!
      }); // cut off the top 10!

    }

    // This function is used to draw and update the data. It takes different data each time.

    function redraw(data, column) {

        var max = d3.max(data, function(d) {return +d[column];});

        xScale = d3.scale.linear()
            .domain([0, max])
            .range([0, width]);

        yScale = d3.scale.ordinal()
            .domain(d3.range(data.length))
            .rangeBands([0, height], .2);


        var bars = vis.selectAll("rect.bar")
            .data(data, function (d) { return d.country}); // key function!

        //update -- existing bars get blue when we "redraw". We don't change labels.
        bars
            .attr("fill", "steelblue");

        //enter - new bars get set to darkorange when we "redraw."
        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("fill", "steelblue");

        //exit -- remove ones that aren't in the index set
        bars.exit()
            .transition()
            .duration(300)
            .ease("exp")
            .attr("width", 0)
            .remove();

        // transition -- move the bars to proper widths and location
        bars
            .transition()
            .duration(500)
            .ease("quad")
            .attr("width", function(d) {
                return xScale(+d[column]);
            })
            .attr("height",  yScale.rangeBand())
            .attr("transform", function(d,i) {
                return "translate(" + [0, yScale(i)] + ")"
            });


        //  We are attaching the labels separately, not in a group with the bars...

        var labels = svg.selectAll("text.labels")
            .data(data, function (d) { return d.country}); // key function!

        // everything gets a class and a text field.  But we assign attributes in the transition.
        labels.enter()
            .append("text")
            .attr("class", "labels");

        labels.exit()
            .remove();

        labels.transition()
            .duration(900)
            .text(function(d) {
                return d.country + " " + (d[column]);
            })
            .attr("transform", function(d,i) {
                    return "translate(" + xScale(+d[column]) + "," + yScale(i) + ")"
            })
            .attr("dy", "1.2em")
            .attr("dx", "-3px")
            .attr("text-anchor", "end");


        } // end of draw function
})();
