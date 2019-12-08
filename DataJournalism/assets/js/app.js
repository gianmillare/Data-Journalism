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

	  //
}