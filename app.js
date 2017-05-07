////////////////////////////////////////////////////////////
// BAR CHART //////////////////////////////////////////////
//////////////////////////////////////////////////////////
(function(d3) {
        'use strict';

var margin = {
    top: 40,
    right: 55,
    bottom: 35,
    left: 90
};
var dataObj;
var width = 600 - margin.left - margin.right,
    height = 360 - margin.top - margin.bottom;

var tooltip = d3.select("body").append("div").attr("class", "tooltip");

var y = d3.scaleBand()
          .range([height, 0])
          .padding(0.1);

var x = d3.scaleLinear()
          .range([0, width + 5]);
          
var svg = d3.select("#bar-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");


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

        data = dataByCamp.sort(function (a, b) {
            return d3.ascending(a.Value, b.Value);
        })


  x.domain([0, d3.max(data, function(d){ return d.Value + 5; })])
  y.domain(data.map(function(d) { return d.Campaign; }));

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
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

  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(5).tickFormat(function(d) { return parseInt(d); }).tickSizeInner([-height]));

  svg.append("g")
      .call(d3.axisLeft(y));

  var bars = svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("g")

  bars.append("text")
    .attr("class", "label")
    .attr("y", function (d) {
        return y(d.Campaign) + y.rangeBand() / 2 + 4;
    })
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
        var donutWidth = 50;
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
            tooltip.select('.Value').html(d.data.Value + " Clicks"); 
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
    width = 1200 - margin.left - margin.right,
    height = 360 - margin.top - margin.bottom;
var legendRectSize = 18;
var legendSpacing = 4;


// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.jan); });

var valueline2 = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.xmas); });

var svg = d3.select("#line-graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data.csv", function convertRow(row) {
    // columns are: Campaign,Click Date,clicked
    return {
      campaign: row.Campaign,
      date: row['Click Date'],
      clicked: parseInt(row.clickedFlag, 10)
    };
  }, 
  function onData(err, data) {
    const totals = data.reduce(function (byDate, entry) {
      if (!byDate[entry.date]) {
        byDate[entry.date] = { date: entry.date }
      }
      if (!byDate[entry.date][entry.campaign]) {
        byDate[entry.date][entry.campaign] = 0
      }
      byDate[entry.date][entry.campaign] += entry.clicked

      return byDate
    }, {})
    
    var data = Object.values(totals)

        var data = data.filter(function (el) {
            return (!el.Unknown);
        }); 

var parseDate = d3.timeParse("%d/%m/%Y");

  data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.jan = d['JAN SALES'];
      d.xmas = d.XMAS;
      if (d.jan === undefined) {
        d.jan = 0;
      }
      if (d.xmas === undefined) {
        d.xmas = 0;
      }
  });

  data.sort(function(a,b){
       var c = a.date;
       var d = b.date;
       return c-d;
  });

 data.splice(-1,1);

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([1, d3.max(data, function(d) {
    return Math.max(d.jan, d.xmas); })]);

  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "turquoise")
      .attr("d", valueline);

  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "blue")
      .attr("d", valueline2);

  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
      .ticks(22));

  svg.append("g")
      .call(d3.axisLeft(y)
        .ticks(7));


//   var legend = svg.selectAll('.legend')
//     .data(color.domain())
//     .enter()
//     .append('g')
//     .attr('class', 'legend')
//     .attr('transform', function(d, i) {
//       var height = legendRectSize + legendSpacing
//       var offset =  height * color.domain().length + 10;
//       var horz =   legendRectSize + 200;
//       var vert = i * height - offset - 70;
//       return 'translate(' + horz + ',' + vert + ')';
//     });

// legend.append('rect')
//   .attr('width', legendRectSize)
//   .attr('height', legendRectSize)                                   
//   .style('fill', color)
//   .style('stroke', color);

});

})(window.d3);

////////////////////////////////////////////////////////////
// PIE FOR WEEKDAYS////////////////////////////////////////
//////////////////////////////////////////////////////////


(function(d3) {
        'use strict';
        var dataObj;
        var width = 600;
        var height = 360;
        var radius = Math.min(width, height) / 2;
        var donutWidth = 180;
        var legendRectSize = 18;
        var legendSpacing = 4;

       var color = d3.scaleOrdinal(d3.schemeCategory20b);

       var svg = d3.select('#pie-chart')
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
          .attr('class', 'weekDay');

        tooltip.append('div')
          .attr('class', 'Value');

        tooltip.append('div')
          .attr('class', 'percent');

        d3.csv("data.csv", function(data) {
              dataObj = data;
              var dataByCount = d3.nest()
              .key(function(d) { return d.weekDay; })
              .rollup(function(leaves){
                return d3.sum(leaves, function(d) {
                  return d.clickedFlag;
              });
              }).entries(data)
                .map(function(d){
                  return { weekDay: d.key, Value: d.value}
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
              return color(d.data.weekDay); 
            })                                                        
            .each(function(d) { this._current = d; });                

          path.on('mouseover', function(d) {
            var total = d3.sum(dataByCount.map(function(d) {
              return (d.enabled) ? d.Value : 0;                       
            }));
            var percent = Math.round(1000 * d.data.Value / total) / 10;
            tooltip.select('.weekDay').html(d.data.weekDay);
            tooltip.select('.Value').html(d.data.Value + " Clicks"); 
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
              var vert = i * height - offset;
              return 'translate(' + horz + ',' + vert + ')';
            });

          legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)                                   
            .style('fill', color)
            .style('stroke', color)                                   
            .on('click', function(weekDay) {                            
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
                if (d.weekDay === weekDay) d.enabled = enabled;           
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