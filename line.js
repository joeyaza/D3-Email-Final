////////////////////////////////////////////////////////////
// LINE GRAPH /////////////////////////////////////////////
//////////////////////////////////////////////////////////

(function(d3) {

  d3.csv("data.csv", function(data) {
  dataObj = data;
  dataObj.forEach(function(d){
      d.Click_date = d['Click Date'];
      delete d['Click Date'];    //remove the original
  });

  var clicksPerDate = d3.nest()
    .key(function(d) { return d.Campaign;})
    .key(function(d) { return d.Click_date;})
    .rollup(function(leaves){
        return d3.sum(leaves, function(d) {
          return d.clickedFlag;
       })
      })
    .entries(dataObj)
    janClicks = clicksPerDate[0];
    XmasClicks = clicksPerDate[2];
    XmasClicks = XmasClicks.values;
  var readDate = d3.timeParse('%d/%m/%Y');    
  var writeDate = d3.timeFormat('%d-%b');

      XmasClicks.forEach(function(d) {
        d.date = readDate(d.key);
        d.clicks = d.value;
        delete d.value;
        delete d.key;
  });
      var dates = XmasClicks.map(function(d) {
        return d.date;
        }).sort(function(a, b) {
        return a - b;
        });
        var scale = d3.scaleTime();
        scale.domain(dates);
    console.log(XmasClicks)

    // set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
// var parseTime = d3.timeParse("%d-%b-%y");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the area
var area = d3.area()
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.clicks); });

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.clicks); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


  // scale the range of the data
  x.domain(d3.extent(XmasClicks, function(d) { return d.date; }));
  y.domain([0, d3.max(XmasClicks, function(d) { return d.clicks; })]);

  // add the area
    svg.append("path")
       .data([XmasClicks])
       .attr("class", "area")
       .attr("d", area);

  // add the valueline path.
  svg.append("path")
      .data([XmasClicks])
      .attr("class", "line")
      .attr("d", valueline);

  // add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

});

})(window.d3);