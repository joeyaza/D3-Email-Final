////////////////////////////////////////////////////////////
// BAR CHART //////////////////////////////////////////////
//////////////////////////////////////////////////////////
(function(d3) {
        'use strict';
// set the dimensions and margins of the graph
var margin = {
    top: 40,
    right: 55,
    bottom: 35,
    left: 90
};
var dataObj;
var width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var tooltip = d3.select("body").append("div").attr("class", "tooltip");

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
      .attr("height", y.bandwidth())
      .on("mousemove", function(d){
          var total = d3.sum(dataByCamp.map(function(d) {
             return d.Value;                     
          }));
        var percent = Math.round(100 * d.Value / total)
            tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html((d.Campaign) + "<br>" + (d.Value) + " Clicks" + "<br>" + percent + " %" );
        })
        .on("mouseout", function(d){ tooltip.style("display", "none");});

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(5).tickFormat(function(d) { return parseInt(d); }).tickSizeInner([-height]));

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
        return y(d.Campaign) + y.rangeBand() / 2 + 4;
    })
    //x position is 3 pixels to the right of the bar
    .attr("x", function (d) {
        return x(d.Value) + 3;
    })
    .text(function (d) {
        return d.Value;
    });
});
})(window.d3);
////////////////////////////////////////////////////////////
// DONUT //////////////////////////////////////////////
//////////////////////////////////////////////////////////
(function(d3) {
        'use strict';
        var dataObj;
        var width = 600;
        var height = 360;
        var radius = Math.min(width, height) / 2;
        var donutWidth = 75;
        var legendRectSize = 18;
        var legendSpacing = 4;

        var color = d3.scaleOrdinal(d3.schemeCategory20b);

       var svg = d3.select('#donut')
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', 'translate(' + (width / 2) + 
            ',' + (height / 2) + ')');

        var arc = d3.arc()
          .innerRadius(radius - donutWidth)
          .outerRadius(radius);

        var pie = d3.pie()
          .value(function(d) { return d.Value; })
          .sort(null);

        var tooltip = d3.select('#donut')
          .append('div')
          .attr('class', 'tooltip');
        
        tooltip.append('div')
          .attr('class', 'Country');

        tooltip.append('div')
          .attr('class', 'Value');

        tooltip.append('div')
          .attr('class', 'percent');

        d3.csv("data.csv", function(data) {
              dataObj = data;
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
          dataByCount.forEach(function(d) {
            d.enabled = true;                                         
          });

          var path = svg.selectAll('path')
            .data(pie(dataByCount))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d, i) { 
              return color(d.data.Country); 
            })                                                        
            .each(function(d) { this._current = d; });                

          path.on('mouseover', function(d) {
            var total = d3.sum(dataByCount.map(function(d) {
              return (d.enabled) ? d.Value : 0;                       
            }));
            var percent = Math.round(1000 * d.data.Value / total) / 10;
            tooltip.select('.Country').html(d.data.Country);
            tooltip.select('.Value').html(d.data.Value); 
            tooltip.select('.percent').html(percent + '%'); 
            tooltip.style('display', 'block');
          });
          
          path.on('mouseout', function() {
            tooltip.style('display', 'none');
          });


          path.on('mousemove', function(d) {
            tooltip.style('top', (d3.event.pageY + 10) + 'px')
              .style('left', (d3.event.pageX + 10) + 'px');
          });
          
            
          var legend = svg.selectAll('.legend')
            .data(color.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
              var height = legendRectSize + legendSpacing
              var offset =  height * color.domain().length + 10;
              var horz =   legendRectSize + 200;
              var vert = i * height - offset - 70;
              return 'translate(' + horz + ',' + vert + ')';
            });

          legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)                                   
            .style('fill', color)
            .style('stroke', color)                                   
            .on('click', function(Country) {                            
              var rect = d3.select(this);                             
              var enabled = true;                                     
              var totalEnabled = d3.sum(dataByCount.map(function(d) {     
                return (d.enabled) ? 1 : 0;                           
              }));                                                    
              
              if (rect.attr('class') === 'disabled') {                
                rect.attr('class', '');                               
              } else {                                                
                if (totalEnabled < 2) return;                         
                rect.attr('class', 'disabled');                       
                enabled = false;                                      
              }                                                       

              pie.value(function(d) {                                 
                if (d.Country === Country) d.enabled = enabled;           
                return (d.enabled) ? d.Value : 0;                     
              });                                                     

              path = path.data(pie(dataByCount));                         

              path.transition()                                       
                .duration(750)                                        
                .attrTween('d', function(d) {                         
                  var interpolate = d3.interpolate(this._current, d); 
                  this._current = interpolate(0);                     
                  return function(t) {                                
                    return arc(interpolate(t));                       
                  };                                                  
                });                                                   
            });                                                       
            
          legend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function(d) { return d; });

        });
})(window.d3);

////////////////////////////////////////////////////////////
// LINE GRAPH /////////////////////////////////////////////
//////////////////////////////////////////////////////////

(function(d3) {


var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the 1st line
var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.jan); });

// define the 2nd line
var valueline2 = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.xmas); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv(
  "data.csv", 
  function convertRow(row) {
    // columns are: Campaign,Click Date,clicked
    return {
      campaign: row.Campaign,
      date: row['Click Date'],
      clicked: parseInt(row.clickedFlag, 10)
    };
  }, 
  function onData(err, data) {
    const totals = data.reduce(function (byDate, entry) {
      // make sure we have a record for this date
      if (!byDate[entry.date]) {
        byDate[entry.date] = { date: entry.date }
      }
      // make sure we have a total for this campaign
      if (!byDate[entry.date][entry.campaign]) {
        byDate[entry.date][entry.campaign] = 0
      }
      // increment the total for this campaign
      byDate[entry.date][entry.campaign] += entry.clicked

      return byDate
    }, {})
    
    var data = Object.values(totals)

        var data = data.filter(function (el) {
            return (!el.Unknown);
        }); 

// parse the date / time
var parseDate = d3.timeParse("%d/%m/%Y");

  // format the data
  data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.jan = d['JAN SALES'];
      d.xmas = d.XMAS;
      if (d.jan === undefined) {
        d.jan = null;
      }
      if (d.xmas === undefined) {
        d.xmas = null;
      }
  });

  data.sort(function(a,b){
       var c = a.date;
       var d = b.date;
       return c-d;
  });

 data.splice(-1,1);

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) {
    return Math.max(d.jan, d.xmas); })]);

  // y.domain([[Math.min(d.jan, d.xmas)], [Math.max(d.jan, d.xmas)]);

  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "turquoise")
      .attr("d", valueline);

  // Add the valueline2 path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "blue")
      .attr("d", valueline2);

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

});

})(window.d3);