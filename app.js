// ////////////////////////////////////////////////////////////
// // BAR CHART //////////////////////////////////////////////
// //////////////////////////////////////////////////////////

// // set the dimensions and margins of the graph
// var margin = {
//     top: 40,
//     right: 55,
//     bottom: 35,
//     left: 90
// };

// var width = 500 - margin.left - margin.right,
//     height = 300 - margin.top - margin.bottom;

// var tooltip = d3.select("body").append("div").attr("class", "toolTip");

// // set the ranges
// var y = d3.scaleBand()
//           .range([height, 0])
//           .padding(0.1);

// var x = d3.scaleLinear()
//           .range([0, width + 5]);
          
// // append the svg object to the body of the page
// // append a 'group' element to 'svg'
// // moves the 'group' element to the top left margin
// var svg = d3.select("#bar-chart").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", 
//           "translate(" + margin.left + "," + margin.top + ")");

//   // format the data
//     d3.csv("data.csv", function(data) {
//       dataObj = data;

//       var dataByCamp = d3.nest()
//       .key(function(d) { return d.Campaign; })
//       .rollup(function(leaves){
//          return d3.sum(leaves, function(d) {
//              return d.clickedFlag;
//       });
//       }).entries(data)
//          .map(function(d){
//              return { Campaign: d.key, Value: d.value}
//          })
//          dataByCamp = [dataByCamp[0], dataByCamp[2]]
//         //sort bars based on value
//         data = dataByCamp.sort(function (a, b) {
//             return d3.ascending(a.Value, b.Value);
//         })

//   // Scale the range of the data in the domains
//   x.domain([0, d3.max(data, function(d){ return d.Value + 5; })])
//   y.domain(data.map(function(d) { return d.Campaign; }));
//   //y.domain([0, d3.max(data, function(d) { return d.Value; })]);

//   // append the rectangles for the bar chart
//   svg.selectAll(".bar")
//       .data(data)
//     .enter().append("rect")
//       .attr("class", "bar")
//       //.attr("x", function(d) { return x(d.Value); })
//       .attr("width", function(d) {return x(d.Value); } )
//       .attr("y", function(d) { return y(d.Campaign); })
//       .attr("height", y.bandwidth())
//       .on("mousemove", function(d){
//             tooltip
//               .style("left", d3.event.pageX - 50 + "px")
//               .style("top", d3.event.pageY - 70 + "px")
//               .style("display", "inline-block")
//               .html((d.Campaign) + "<br>" + (d.Value) + " Clicks");
//         })
//         .on("mouseout", function(d){ tooltip.style("display", "none");});

//   // add the x Axis
//   svg.append("g")
//       .attr("transform", "translate(0," + height + ")")
//       .call(d3.axisBottom(x).ticks(5).tickFormat(function(d) { return parseInt(d); }).tickSizeInner([-height]));

//   // add the y Axis
//   svg.append("g")
//       .call(d3.axisLeft(y));

//   var bars = svg.selectAll(".bar")
//     .data(data)
//     .enter()
//     .append("g")

//   bars.append("text")
//     .attr("class", "label")
//     //y position of the label is halfway down the bar
//     .attr("y", function (d) {
//         return y(d.Campaign) + y.rangeBand() / 2 + 4;
//     })
//     //x position is 3 pixels to the right of the bar
//     .attr("x", function (d) {
//         return x(d.Value) + 3;
//     })
//     .text(function (d) {
//         return d.Value;
//     });
// });

////////////////////////////////////////////////////////////
// DONUT //////////////////////////////////////////////
//////////////////////////////////////////////////////////
d3.csv("data.csv", function(data) {
  dataObj = data;
  console.log(data)
  var dataByCount = d3.nest()
  .key(function(d) { return d.Country; })
  .rollup(function(leaves){
    return d3.sum(leaves, function(d) {
      return d.clickedFlag;
  });
  }).entries(data)
    .map(function(d){
      return { Country: d.key, Value: d.value}
    })
console.log(dataByCount)



var margin = {
    top: 40,
    right: 55,
    bottom: 35,
    left: 90
};

var width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var radius = Math.min(width, height) / 2;
var donutWidth = 50;                            // NEW
var color = d3.scaleOrdinal(d3.schemeCategory20b);
var svg = d3.select("#donut").append("svg")
  .append('svg')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + (width / 2) +
    ',' + (height / 2) + ')');
var arc = d3.arc()
  .innerRadius(radius - donutWidth)             // UPDATED
  .outerRadius(radius);
var pie = d3.pie()
  .value(function(d) { return d.Value; })
  .sort(null);
var path = svg.selectAll('path')
  .data(pie(dataByCount))
  .enter()
  .append('path')
  .attr('d', arc)
  .attr('fill', function(d, i) {
    return color(d.Country);
  });
});