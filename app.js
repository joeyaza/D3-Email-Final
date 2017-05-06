////////////////////////////////////////////////////////////
// BAR CHART //////////////////////////////////////////////
//////////////////////////////////////////////////////////



// set the dimensions and margins of the graph
    var margin = {
        top: 40,
        right: 55,
        bottom: 35,
        left: 90
    };

    var width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

// set the ranges
var y = d3.scaleBand()
          .range([height, 0])
          .padding(0.1);

var x = d3.scaleLinear()
          .range([0, width + 5]);
          
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#bar-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

  // format the data
    d3.csv("data.csv", function(data) {
      dataObj = data;

      var dataByCamp = d3.nest()
      .key(function(d) { return d.Campaign; })
      .rollup(function(leaves){
         return d3.sum(leaves, function(d) {
             return d.clickedFlag;
      });
      }).entries(data)
         .map(function(d){
             return { Campaign: d.key, Value: d.value}
         })
         dataByCamp = [dataByCamp[0], dataByCamp[2]]
         console.log(dataByCamp)
        //sort bars based on value
        data = dataByCamp.sort(function (a, b) {
            return d3.ascending(a.Value, b.Value);
        })

  // Scale the range of the data in the domains
  x.domain([0, d3.max(data, function(d){ return d.Value + 5; })])
  y.domain(data.map(function(d) { return d.Campaign; }));
  //y.domain([0, d3.max(data, function(d) { return d.Value; })]);

  // append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      //.attr("x", function(d) { return x(d.Value); })
      .attr("width", function(d) {return x(d.Value); } )
      .attr("y", function(d) { return y(d.Campaign); })
      .attr("height", y.bandwidth());

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

          var bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("g")


       bars.append("text")
          .attr("class", "label")
          //y position of the label is halfway down the bar
          .attr("y", function (d) {
              return y(d.Campaign) + y.bandwidth() / 2 + 4;
          })
          //x position is 3 pixels to the right of the bar
          .attr("x", function (d) {
              return x(d.Value) + 3;
          })
          .text(function (d) {
              return d.Value;
          });
});


