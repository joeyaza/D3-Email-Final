
  d3.csv("data.csv", function(data) {
  dataObj = data;
  dataObj.forEach(function(d){
      d.Click_date = readDate(d['Click Date']);
      delete d['Click Date'];    //remove the original
  });

console.log(dataObj)

  var clicksPerDate = d3.nest()
    // .key(function(d) { return d.Campaign;})
    .key(function(d) { return d.Click_date})
    .rollup(function(leaves){
        return d3.sum(leaves, function(d) {
          return d.clickedFlag;
       })
      })
    .entries(dataObj)

console.log(clicksPerDate)


    var dataObj = dataObj.filter(function (el) {
        return (el.Campaign != "Unknown" );
    }); 

    var maxDate = d3.max(dataObj, d => d.Click_date);
    var minDate = d3.min(dataObj, d => d.Click_date);

    var minClicks = d3.min(clicksPerDate, d => d.value);
    var maxClicks = d3.max(clicksPerDate, d => d.value);


  var clicksByDate = d3.nest()
    .key(function(d) { return d.Campaign;})
    .key(function(d) { return d.Click_date;})
    .rollup(function(leaves){
        return d3.sum(leaves, function(d) {
          return d.clickedFlag;
       })
      })
    .entries(dataObj)

    console.log(clicksByDate)



    janClicks = clicksByDate[0];
    janClicks = janClicks.values;
    XmasClicks = clicksByDate[1];
    XmasClicks = XmasClicks.values;

      XmasClicks.forEach(function(d) {
        d.Xmasdate = d.key;
        d.Xmasclicks = d.value;
        delete d.value;
        delete d.key;
      });
      janClicks.forEach(function(d) {
        d.Jandate = d.key;
        d.Janclicks = d.value;
        delete d.value;
        delete d.key;
      });

       XmasClicks.sort(function(a,b){
          var c = new Date(a.Xmasdate);
          var d = new Date(b.Xmasdate);
          return c-d;
      });

       janClicks.sort(function(a,b){
          var c = new Date(a.Jandate);
          var d = new Date(b.Jandate);
          return c-d;
      });