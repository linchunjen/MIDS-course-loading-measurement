// create modules for plotting bar charts of score difference and raw sleeping score 

var viz_lib = viz_lib || {};

// create first bar plot function that allow bar chart can display positive and negative values
viz_lib.barPlotPN = function () {

  // set the dimensions and margins of the graph
  var w = 1200;
  var h = 500;

  var margin = {
    top: 20,
    right: 150,
    bottom: 50,
    left: 50
  };
  var figw = w - margin.left - margin.right;
  var figh = h - margin.top - margin.bottom;

  var x = d3.scaleLinear().range([margin.left, margin.left + figw]);
  var y = d3.scaleLinear().range([margin.top + figh, margin.top]);

  // create callback fuction
  var callback = function () {};
  var callback_ = function (_) {
    var that = this;
    if (!arguments.length) return callback;
    callback = _;
    return that;
  };

  // data loading
  var data = [];
  var data_ = function (_) {
    var that = this;
    if (!arguments.length) return data;
    data = _;
    return that;
  };

  // create plotting function of bar chart 
  var plot_ = function () {

    // console.log(data);

    // create X and Y data for plotting
    var xData = [];
    for (var i = 0; i < data.length; i++) {
      xData[i] = data[i][0];
    };

    var yData = [];
    for (var i = 0; i < data.length; i++) {
      yData[i] = data[i][1];
    };

    // console.log(xData);
    // console.log(yData);


    x.domain([1, xData.length]);
    y.domain([1, yData]);

    // set up canvas
    var svg = d3
      .select("div#viz")
      .append("svg")
      .attr("width", figw + margin.left + margin.right)
      .attr("height", figh + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var maxHeight = d3.max(yData, function (d) {
      return Math.abs(d);
    });

    // console.log(maxHeight);

    // plot bar chart with tooltip that displays day and sleeping score diffenece 
    // using callback to create raw score plot when mouse over the bar 
    var xScale = d3.scaleBand().rangeRound([0, figw]).padding(0.1).domain(xData);
    var yScale = d3.scaleLinear().rangeRound([0, figh]).domain([maxHeight, -maxHeight]);

    var bars = svg.selectAll("rect").data(yData).enter().append("rect").on("mousemove", function (d, i) {
        var that = this;
        // console.log(d);
        // console.log(i);
        hoverGroup.attr("transform", function () {
          return "translate(" + (d3.mouse(that)[0]) + "," + (xScale.bandwidth() + d3.mouse(that)[1]) + ")";
        });
      })
      .on("mouseout", function (d) {
        hoverGroup.style("visibility", "hidden");
      })
      .on("mouseover", function (d, i) {
        hoverText.text("Day:" + (i + 1) + "; Difference:" + d);
        hoverGroup.style("visibility", "visible");
        callback(i);
      });

    var hoverGroup = svg.append("g").style("visibility", "hidden");

    hoverGroup.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 5)
      .attr("height", 5)
      .attr("fill", "#000000");

    var hoverText = hoverGroup.append("text").attr("x", 10).attr("y", 10);

    bars.attr("x", function (d, i) {
        return xScale(i + 1);
      })
      .attr("y", function (d) {
        if (d < 0) {
          return figh / 2;
        } // add bar with negative values to middle
        else {
          return yScale(d);
        }
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function (d) {
        return figh / 2 - yScale(Math.abs(d));
      });

    bars.attr("fill", function (d) {
      if (d >= 0) {
        return "#4169E1";
      } else {
        return "#F08080";
      }
    });

    // setup x-axis and y-axis
    var yAxis = d3.axisLeft(yScale);
    svg.append("g").call(yAxis);

    var xAxis = d3.axisBottom(xScale);

    svg.append("g").call(xAxis).attr("transform", "translate(0," + figh / 2 + ")");

    // give label to y-axis 
    svg.append("text").text("Fitbit sleeping Score difference (W261-W251)")
      .attr("x", 0 - figh / 2)
      .attr("y", 0 - margin.left)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr("transform", "rotate(-90)");

    // give label to x-axis 
    svg.append("text").text("Days")
      .attr("x", figw / 2)
      .attr("y", figh)
      .style("text-anchor", "middle");

  };

  var public = {
    "plot": plot_,
    "data": data_,
    "callback": callback_
  };

  return public;
};

// create second bar plot function to plot raw sleeping scores
viz_lib.barPlot = function () {

  // set the dimensions and margins of the graph
  var w = 250;
  var h = 200;

  var margin = {
    top: 20,
    right: 50,
    bottom: 50,
    left: 50
  };
  var figw = w - margin.left - margin.right;
  var figh = h - margin.top - margin.bottom;

  var data = [];
  var data_ = function (_) {
    var that = this;
    if (!arguments.length) return data;
    data = _;
    return that;
  };

  // create plotting function of bar chart 
  var plot_ = function () {

    // console.log(data);

    // create data for bar chart 
    var xData = [
      ('W251_Day-' + data[0]), ('W261_Day-' + data[0])
    ];

    var yData = [data[1], data[2]];

    // console.log(xData);
    // console.log(yData);

    var updated_data = [];
    for (var i = 0; i < xData.length; i++) {
      updated_data[i] = [xData[i], yData[i]];
    }

    // console.log(updated_data);

    // plot bar chart of W251 and W261 raw sleeping scores 
    var maxHeight = d3.max(yData, function (d) {
      return d;
    });

    var xScale = d3.scaleBand().rangeRound([0, figw]).padding(0.1).domain(xData);
    var yScale = d3.scaleLinear().rangeRound([0, figh]).domain([maxHeight, 0]);

    var svg = d3
      .select("div#viz2")
      .append("svg")
      .attr("width", figw + margin.left + margin.right)
      .attr("height", figh + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var bars = svg.selectAll("rect").data(updated_data).enter().append("rect");

    bars.attr("x", function (d) {
        return xScale(d[0]);
      })
      .attr("y", function (d) {
        return yScale(d[1]);
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function (d) {
        return figh - yScale(d[1]);
      });

    bars.attr("fill", "#00CED1");

    // setup x-axis and y-axis
    var yAxis = d3.axisLeft(yScale);
    svg.append("g").call(yAxis);

    var xAxis = d3.axisBottom(xScale);

    svg.append("g").call(xAxis).attr("transform", "translate(0," + figh + ")");

    // give label to y-axis 
    svg.append("text").text("Raw Sleeping Score")
      .attr("x", 0 - figh / 2)
      .attr("y", 0 - margin.left)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr("transform", "rotate(-90)");

    // give label to x-axis 
    svg.append("text").text("class")
      .attr("x", figw / 2)
      .attr("y", figh + 40)
      .style("text-anchor", "middle")

  };

  var public = {
    "plot": plot_,
    "data": data_,
  };

  return public;
};


// plot score data
d3.csv("https://raw.githubusercontent.com/linchunjen/Sleeping_data/master/W261_W251_sleeping_score.csv",
  function (error, data) {

    if (error) throw err;

    var dayScoreDiff = data.map(function (d) {
      return [d.Day, d.W251W261];
    });

    var rawScore = data.map(function (d) {
      return [d.Day, d.W251, d.W261];
    });

    var barChartPN = viz_lib.barPlotPN();
    barChartPN.data(dayScoreDiff);
    barChartPN.plot();
    var barChart = viz_lib.barPlot();
    barChartPN.callback(function (i) {
      barChart.data(rawScore[i]);
      barChart.plot();
    });
  }
);

// ===========================================================================================================

// set the dimensions and margins of the graph
var margin = {
    top: 20,
    right: 150,
    bottom: 50,
    left: 50
  },
  width = 1100 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("div#viz3")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

// read the data
d3.csv("https://raw.githubusercontent.com/linchunjen/Sleeping_data/master/W261_W251_sleeping_information.csv", function (data) {

  // list of groups
  var allGroup = ["W251MinutesAsleep", "W261MinutesAsleep", "W251MinutesAwake", "W261MinutesAwake", "W251MinutesREMSleep",
    "W261MinutesREMSleep", "W251MinutesLightSleep", "W261MinutesLightSleep", "W251MinutesDeepSleep", "W261MinutesDeepSleep"
  ];

  // add the options to the button
  d3.select("#selectButton")
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) {
      return d;
    }) // text showed in the menu
    .attr("value", function (d) {
      return d;
    }); // corresponding value returned by the button

  // give one color for each group using a color scale
  var myColor = d3.scaleOrdinal()
    .domain(allGroup)
    .range(d3.schemeSet2);

  // add X axis 
  var x = d3.scaleLinear()
    .domain([0, 60])
    .range([0, width]);

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // add Y axis
  var y = d3.scaleLinear()
    .domain([0, 500])
    .range([height, 0]);

  svg.append("g")
    .call(d3.axisLeft(y));

  // plot the data with line chart
  var line = svg
    .append('g')
    .append("path")
    .datum(data)
    .attr("d", d3.line()
      .x(function (d) {
        return x(+d.Day);
      })
      .y(function (d) {
        return y(+d.W251MinutesAsleep);
      })
    )
    .attr("stroke", function (d) {
      return myColor("valueA");
    })
    .style("stroke-width", 4)
    .style("fill", "none");

  // give label to y-axis 
  svg.append("text").text("Minutes")
    .attr("x", 0 - height / 2)
    .attr("y", 0 - margin.left)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .attr("transform", "rotate(-90)");

  // give label to x-axis 
  svg.append("text").text("Days")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .style("text-anchor", "middle");

  // generate a function that update the chart
  function update(selectedGroup) {
    // Create new data with the selection?
    var dataFilter = data.map(function (d) {
      return {
        time: d.Day,
        value: d[selectedGroup]
      };
    });

    // give these new data to update line
    line
      .datum(dataFilter)
      .transition()
      .duration(1000)
      .attr("d", d3.line()
        .x(function (d) {
          return x(+d.time);
        })
        .y(function (d) {
          return y(+d.value);
        })
      )
      .attr("stroke", function (d) {
        return myColor(selectedGroup);
      });
  }

  // when the button is changed, run the updateChart function
  d3.select("#selectButton").on("change", function (d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")
    // run the updateChart function with this selected option
    update(selectedOption);
  });
});