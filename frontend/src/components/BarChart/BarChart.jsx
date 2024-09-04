import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data, width = 600, height = 400, xLabel = 'X Label', yLabel = 'Y Label' }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Clear previous svg content before re-rendering
    d3.select(svgRef.current).selectAll('*').remove();

    // Setup the SVG canvas dimensions
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background", "#f0f0f0")
      .style("padding", "10px");

    // Create scaling functions
    const xScale = d3.scaleBand()
      .domain(data.map((_, idx) => idx))
      .range([0, width])
      .padding(0.3);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([height, 0]);

    // Append bars to the svg
    svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (val, idx) => xScale(idx))
      .attr("y", yScale)
      .attr("width", xScale.bandwidth())
      .attr("height", val => height - yScale(val))
      .attr("fill", "#69b3a2");

    // Add X-axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(data.length))
      .selectAll("text")  // Style X-axis text
      .style("font-size", "12px")
      .style("text-anchor", "middle");

    // Add Y-axis
    svg.append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")  // Style Y-axis text
      .style("font-size", "12px");

    // Add X-axis label
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + 40)  // Adjusted to be below the X-axis
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text(xLabel);

    // Add Y-axis label
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(-50, ${height / 2})rotate(-90)`)  // Adjust Y-axis label position
      .style("font-size", "14px")
      .text(yLabel);

  }, [data, height, width, xLabel, yLabel]);

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default BarChart;

