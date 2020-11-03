
class YearChart {

  /**
   * Constructor for the Year Chart
   *
   * @param electoralVoteChart instance of ElectoralVoteChart
   * @param tileChart instance of TileChart
   * @param votePercentageChart instance of Vote Percentage Chart
   * @param electionInfo instance of ElectionInfo
   * @param electionWinners data corresponding to the winning parties over mutiple election years
   */
  constructor (electoralVoteChart, tileChart, votePercentageChart, electionWinners) {

    //Creating YearChart instance
    this.electoralVoteChart = electoralVoteChart;
    this.tileChart = tileChart;
    this.votePercentageChart = votePercentageChart;
    // the data
    this.electionWinners = electionWinners;
    
    // Initializes the svg elements required for this chart
    this.margin = {top: 10, right: 20, bottom: 30, left: 50};
    let divyearChart = d3.select("#year-chart").classed("fullView", true);

    //fetch the svg bounds
    this.svgBounds = divyearChart.node().getBoundingClientRect();
    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
    this.svgHeight = 100;

    //add the svg to the div
    this.svg = divyearChart.append("svg")
      .attr("width", this.svgWidth)
      .attr("height", this.svgHeight);

    this.selected = null;
  }

  /**
   * Returns the class that needs to be assigned to an element.
   *
   * @param party an ID for the party that is being referred to.
   */
  chooseClass (data) {
    if (data == "R") {
      return "yearChart republican";
    }
    else if (data == "D") {
      return "yearChart democrat";
    }
    else if (data == "I") {
      return "yearChart independent";
    }
  }

  /**
   * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
   */
  update () {

    //Domain definition for global color scale
    let domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];

    //Color range for global color scale
    let range = ["#063e78", "#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#860308"];

    //ColorScale be used consistently by all the charts
    this.colorScale = d3.scaleQuantile()
      .domain(domain)
      .range(range);

    // ******* TODO: PART I *******

    // Create the chart by adding circle elements representing each election year
    let r = 10;
    let xscale = d3.scaleLinear()
      .domain([0, this.electionWinners.length])
      .range([3*r, this.svgWidth-3*r]);

    this.svg.selectAll('line')
      .data(this.electionWinners)
      .enter()
      .append('line')
      .attr('x1', (d,i) => xscale(i))
      .attr('y1', r+4)
      .attr('x2', (d,i) => i>0 ? xscale(i-1) : xscale(i))
      .attr('y2', r+4)

      .classed('lineChart', true)
    ;

    this.svg.selectAll('circle')
      .data(this.electionWinners)
      .enter()
      .append('circle')
      .attr('cx', (d,i) => xscale(i))
      .attr('cy', r+4)
      .attr('r', r)
      .attr('class', d => this.chooseClass(d.PARTY))
      .classed('yearChart', true)
      .attr('id', d => `y${d.YEAR}`)
      .on('click', d => {
        this.selectYear(d3.select(d3.event.target), d);
      });
    ;

    this.svg.selectAll('text')
      .data(this.electionWinners)
      .enter()
      .append('text')
      .attr('x', (d,i) => xscale(i))
      .attr('y', r+8)
      .attr('dy', '1.3em')
      .text(d => d.YEAR)
      .classed('yeartext', true)
    ;

    //The circles should be colored based on the winning party for that year
    //HINT: Use the .yearChart class to style your circle elements
    //HINT: Use the chooseClass method to choose the color corresponding to the winning party.

    //Append text information of each year right below the corresponding circle
    //HINT: Use .yeartext class to style your text elements

    //Style the chart by adding a dashed line that connects all these years.
    //HINT: Use .lineChart to style this dashed line

    //Clicking on any specific year should highlight that circle and  update the rest of the visualizations
    //HINT: You can get the d3 selection that was clicked on using
    //   d3.select(d3.event.target)
    //HINT: Use .highlighted class to style the highlighted circle

    //Election information corresponding to that year should be loaded and passed to
    // the update methods of other visualizations


    //******* TODO: EXTRA CREDIT *******

    //Implement brush on the year chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.

  }

  selectYear(selected, d) {
    if (this.selected) {
      this.selected.classed('highlighted', false);
    }
    this.selected = selected;
    this.selected.classed('highlighted', true);

    d3.csv(`data/Year_Timeline_${d.YEAR}.csv`).then(year => {
      // console.log(year);
      this.electoralVoteChart.update(year, this.colorScale);
      this.tileChart.update(year, this.colorScale);
      this.votePercentageChart.update(year, this.colorScale);
    });
    
  }

}
