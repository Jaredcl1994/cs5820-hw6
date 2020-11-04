/** Class implementing the bar chart view. */
class BarChart {
  constructor() {
        this.selectedElement = null;
        this.selectedDatum = null;
    }
  /**
   * Render and update the bar chart based on the selection of the country from the map
  * @param allData data including population, gdp, mortality rate for one entity.
   */
  update(allData) {
    let year = 2012;
    let words = ['flashing', 'ball', 'lights', 'saucer', 'diamond', 'square', 'circle', 'cloud'];
    let wordInfo = new Object();
    for (let word of words) {
      wordInfo[word] = {'word': word, 'count': 0};
    }

    let keys = Object.keys(allData[year]);
    for (let i=0; i<keys.length; i++) {
      let statewords = allData[year][keys[i]].words.split(' ');
      for (let word of statewords) {
        if (words.includes(word.toLowerCase())) {
          wordInfo[word.toLowerCase()].count += 1;
        }
      }
    }

    let min = 0;
    let max = -1000;
    keys = Object.keys(wordInfo);
    for (let i=0; i<keys.length; i++) {
      if (wordInfo[keys[i]].count > max) {
        max = wordInfo[keys[i]].count;
      }
    }

    let height = 200;

    // Create the x and y scales; make
    // sure to leave room for the axes
    let xScale = d3.scaleBand()
      .domain(words)
      .range([0, 400])
      .padding(0.25)
    ;

    let yScale = d3.scaleLinear()
      .domain([0, max])
      .range([height, 0]);

    // Create colorScale
    let colorScale = d3.scaleLinear()
      .domain([min, max])
      .range(["darkgray", "steelblue"]);

    let yaxisWidth = 60;

    // Create the axes (hint: use #xAxis and #yAxis)
    let xAxis = d3.axisBottom(xScale);
    d3.select('#xAxis')
      .attr("transform", `translate(${yaxisWidth}, ${height})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(90)")
      .attr("x", 9)
      .attr("dy", "-.35em")
      .style("text-anchor", "start");

    let yAxis = d3.axisLeft(yScale);
    d3.select('#yAxis')
      .attr("transform", `translate(${yaxisWidth}, 0)`)
      .call(yAxis)
      .selectAll("text");

    console.log('word info');
    console.log(wordInfo);

    let bars = d3.select('#bars')
      .selectAll('rect')
      .data(wordInfo)
      .enter()
      .append('rect')
        .attr('width', xScale.bandwidth())
        .attr('x', function(d) {
          console.log(xScale(d.word));
          return yaxisWidth+xScale(d.word);
        })
          // no bar at the beginning thus:
        .attr("height", function(d) {
          console.log('here');
          return height - yScale(0);
        }) // always equal to 0
        .attr("y", function(d) { return yScale(0); });

    d3.select('#bars').selectAll('rect')
    .transition()
    .duration(900)
    .delay(50)
      .attr('y', function(d,i) {
        console.log('transition');
        return yScale(d.count);
      })
      .attr('height', (d,i) => height-yScale(d.count))
      .attr('fill', (d,i) => colorScale(d.count));


    let bc = this;

    // Implement how the bars respond to click&hover events
    // Color the selected bar to indicate is has been selected.
    // Make sure only the selected bar has this new color.
    // d3.select('#bars').selectAll('rect')
      // .on('click', function(d, i) {
        // if (bc.selectedElement != null) {
          // bc.selectedElement.attr(
            // 'fill', colorScale(bc.selectedDatum.Mortality));
        // }
        // bc.selectedElement = d3.select(this);
        // bc.selectedDatum = d;
        // bc.selectedElement.attr('fill', 'red');
//
        // bc.infoPanel.update(d);
      // })
    // ;

  }
}
