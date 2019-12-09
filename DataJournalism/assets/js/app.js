//Set up the width, height, and margins
var width = parseInt(d3.select("#scatter").style("width"));
var height = width - width / 4.0;
var margin = 20;

//Extra padding for the bottom and left axis texts
var labelArea = 110;
var bottomPad = 45;
var leftPad = 45;

//Using SVG to create the area for the graph
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

//Set a radius for each circle used in the graph --> easier to call functions
var radius;
function getRadius() {
	if (width <= 525) {
		radius = 5;
	}
	else {
		radius = 10;
	}
}
getRadius();

//Start nesting beginning with the bottom (X) axis
svg.append("g").attr("class", "xText");
var xText = d3.select(".xText");
//Recommended to use "transform" to place the xText at the bottom
function xTextRefresh() {
	xText.attr(
	  "transform",
	  "translate(" +
	  ((width - labelArea) / 2 + labelArea) +
	  ", " +
	  (height - margin - bottomPad) +
	  ")"
	);
}
xTextRefresh();

//Use xText to append three files on three values we want to display
xText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("In Poverty (%)");

xText
  .append("text")
  .attr("y", 0)
  .attr("data-name", "age")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Age (Median)");

xText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "income")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Household Income (Median)");

//Repeat the above but for the Y axis, but we will specify variables first to make coding the function easier
var leftTextX = margin + leftPad;
var leftTextY = (height + labelArea) / 2 - labelArea;

//Start nesting with the left (Y) axis
svg.append("g").attr("class", "yText");
var yText = d3.select(".yText");

//Recommended to use "transform" to place the yText on the left
function yTextRefresh() {
	yText.attr(
	  "transform",
	  "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
	);
}
yTextRefresh();

//Just like before, we use yText to append three files on three values we want to display
yText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "obesity")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Obese (%)");

yText
  .append("text")
  .attr("x", 0)
  .attr("data-name", "smokes")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Smokes (%)");

yText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "healthcare")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Lacks Healthcare (%)");

//Now that we've created sizing criteria, we can start creating the graph itself
//Start by importing the dataset's CSV file, visualize using the "visualize" function
d3.csv("assets/data/data.csv").then(function(data) {
	visualize(data);
});

//Create the visualize function
function visualize(visual) {
	//creating variables that will represent the variables (headings) from the csv file
	var curX1 = "poverty";
	var curX2 = "age";
	var curX3 = "income";
	var curY1 = "obesity";
	var curY2 = "smokes";
	var curY3 = "healthcare";

	//create empty variables for the min and max of X and Y
	var xMin;
	var xMax;
	var yMin;
	var yMax;

	//Create a function that allows to use tooltip rules (recommended in the assignment guidelines)
	var toolTip = d3
	  .tip()
	  .attr("class", "d3-tip")
	  .offset([40, -60])
	  .html(function(d) {
	  	var axisX;
	  	var theState = "<div>" + d.state + "</div>";
	  	var axisY = "<div>" + curY1 + ": " + d[curY1] + "%</div>";

	  	if (curX1 === "poverty") {
	  		axisX = "<div>" + curX1 + ": " + d[curX1] + "%</div>";
	  	}
	  	else {
	  		axisX = "<div>" +
	  		  curX1 +
	  		  ": " +
	  		  parseFloat(d[curX1]).toLocaleString("en") +
	  		  "</div>";
	  	}
	  	return theState + axisX + axisY;
	  });

	  //Call the toolTip Function
	  svg.call(toolTip);

	  //Creating Min and Max function for X and Y
	  //--> each min and max will grab the smallest and largest datum from that column
	  function xMinMax() {
	  	xMin = d3.min(visual, function (d) {
	  		return parseFloat(d[curX1]) * 0.90;
	  	});
	  	xMax = d3.max(visual, function(d) {
	  		return parseFloat(d[curX1] * 1.10);
	  	});
	  }

	  //repeating the above for Y Min and Max
	  function yMinMax() {
	  	yMin = d3.min(visual, function (d) {
	  		return parseFloat(d[curY1]) * 0.90;
	  	});

	  	yMax = d3.max(visual, function(d) {
	  		return parseFloat(d[curY1]) * 1.10;
	  	});
	  }
	  // Create a function that changes classes and appearance based on which label is clicked
	  function changeLabels(axis, clickedText) {
	  	d3
	  	  .selectAll(".aText")
      	  .filter("." + axis)
      	  .filter(".active")
      	  .classed("active", false)
      	  .classed("inactive", true);
      	//use an "active" & "inactive" code to switch texts
      	clickedText.classed("inactive", false).classed("active", true);
	  }

	  //Instantiate the Scatter Plot

	  //start by grabbing the min and max values from the functions we made prior
	  xMinMax();
	  yMinMax();

	  //Format the scales based on the areas holding text and margins
	  var xScale = d3
	    .scaleLinear()
	    .domain([xMin, xMax])
	    .range([margin + labelArea, width - margin]);
	  var yScale = d3
	    .scaleLinear()
	    .domain([yMin, yMax])
	    .range([height - margin - labelArea, margin]);

	  var xAxis = d3.axisBottom(xScale);
	  var yAxis = d3.axisLeft(yScale);

	  function tickers() {
	  	if (width <= 500) {
	  		xAxis.ticks(5);
	  		yAxis.ticks(5);
	  	}
	  	else {
	  		xAxis.ticks(10);
	  		yAxis.ticks(10);
	  	}
	  }
	  tickers();

	  //Start using the "transform" attribute to append axes and specify location
	  svg
    	.append("g")
    	.call(xAxis)
    	.attr("class", "xAxis")
    	.attr("transform", "translate(0," + (height - margin - labelArea) + ")");
  	  svg
    	.append("g")
    	.call(yAxis)
    	.attr("class", "yAxis")
    	.attr("transform", "translate(" + (margin + labelArea) + ", 0)");

      //Create the dots/circles that will appear on the graph
      var circleGroup = svg.selectAll("g circleGroup").data(visual).enter();

      //append each circle for each row of data
      circleGroup
        .append("circle")
        //create attributes to specify location, size, and class
        .attr("cx", function (d) {
        	return xScale(d[curX1]);
        })
        .attr("cy", function(d) {
        	return yScale(d[curY1]);
        })
        .attr("r", radius)
        .attr("class", function(d) {
        	return "stateCircle " + d.abbr;
        })
        //Create the hover rules to show info when you hover over the circle
        .on("mouseover", function(d) {
        	toolTip.show(d, this);
        	d3.select(this).style("stroke", "#0000FF");
        })
        .on("mouseout", function(d) {
        	toolTip.hide(d);
        	d3.select(this).style("stroke", "#00FFFF")
        });

      //append the circles again but add in labels using the state abbreviations. Place them in the circles
      circleGroup
        .append("text")
        .text(function(d) {
        	return d.abbr;
        })
        //place the text inside the circles
        .attr("dx", function(d) {
        	return xScale(d[curX1]);
        })
        .attr("dy", function(d) {
        	return yScale(d[curY1]) + radius / 2.5;
        })
        .attr("font-size", radius)
        .attr("class", "stateText")
        //coding the Hover Rules again
        .on("mouseover", function(d) {
        	toolTip.show(d);
        	d3.select("." + d.abbr).style("stroke", "#8B0000");
        })
        .on("mouseout", function(d) {
        	toolTip.hide(d);
        	d3.select("." + d.abbr).style("stroke", "#E9967A");
        });
}