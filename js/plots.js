var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
var chosenYAxis='UnemploymentRate';
var chosenXAxis='AllAgesinPovertyPercent';

function yScale(data, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
    .domain([0 ,
    d3.max(data, d => d[chosenYAxis]+1) 
    ])
    .range([height, 0]);

    return yLinearScale;

}

function xScale(data, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
    .domain([3 ,
        d3.max(data, d => (d[chosenXAxis])) 
    ])
    .range([0, width]);

    return xLinearScale;

}

function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
    return yAxis;
    }

function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    return xAxis;
    }
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
    }

function updateToolTip(chosenXAxis, circlesGroup) {
    chosenXAxis="AllAgesinPovertyPercent";
    
    
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([70, -40])
        .html(function(d) {
        return (`${d.County}<br>Unemployment Rate: ${d.UnemploymentRate}<br>Poverty Rate: ${d.AllAgesinPovertyPercent}`);
        });
    
    circlesGroup.call(toolTip);
    
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data,this);
    })
        .on("mouseout", function(data, index) {
        toolTip.hide(data, this);
        });
    
    return circlesGroup;
    }

d3.csv("../Resources/mo_data.csv").then(function(data, err){
    if (err) throw err;
    data.forEach(function(data){
        data.UnemploymentRate= +data.UnemploymentRate;
        data.AllAgesinPovertyPercent =+data.AllAgesinPovertyPercent;
                
    });
    var xLinearScale=xScale(data, "AllAgesinPovertyPercent");
    var yLinearScale=yScale(data, "UnemploymentRate");
    var bottomAxis=d3.axisBottom(xLinearScale);
    var leftAxis=d3.axisLeft(yLinearScale);
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    chartGroup.append("g")
        .call(leftAxis);
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
        .text("Poverty Rate (%))");
    chartGroup.append("text")
        .attr("transform", `translate(-50, ${height/2}) rotate(-90)`)
        .text("Unemployment Rate (%)");
        
    var circlesGroup=chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.AllAgesinPovertyPercent))
        .attr("cy", d => yLinearScale(d.UnemploymentRate))
        .attr("r", 10)
        .attr("fill", "lightblue")
        .attr("opacity", ".55")
        
        var circlesGroup=updateToolTip(chosenXAxis, circlesGroup);


        var lr=linearRegression(data);
        var drawLine=d3.line()
            .x(d=>xLinearScale(d.AllAgesinPovertyPercent))
            .y(d=>yLinearScale((lr['slope'])*d.AllAgesinPovertyPercent+lr['intercept']))
        

       chartGroup.append('path')
        .attr('d', drawLine(data))
        .classed('line', true);
        
    

  
      }).catch(function(error) {
    console.log(error);
  });
//https://bl.ocks.org/ctufts/298bfe4b11989960eeeecc9394e9f118
  function linearRegression(data){
    var x=data.map(d=>+d.AllAgesinPovertyPercent);
    var y=data.map(d=>+d.UnemploymentRate);
    var lr = {};
    var n = y.length;
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var sum_yy = 0;

    for (var i = 0; i < y.length; i++) {

        sum_x += x[i];
        sum_y += y[i];
        sum_xy += (x[i]*y[i]);
        sum_xx += (x[i]*x[i]);
        sum_yy += (y[i]*y[i]);
    }

    lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
    lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
    lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);
    var x1=4;
    var y1=lr['slope']*x1+lr['intercept'];
    var x2=29;
    var y2=lr['slope']*x2+lr['intercept'];
    var line=d3.line()
        .x(x1,x2)
        .y(y1,y2)
    return lr;
}