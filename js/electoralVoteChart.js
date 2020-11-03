
class ElectoralVoteChart {
  /**
   * Constructor for the ElectoralVoteChart
   *
   * @param shiftChart an instance of the ShiftChart class
   */
  constructor (shiftChart, tooltip){
    this.shiftChart = shiftChart;
    
    this.margin = {top: 30, right: 20, bottom: 30, left: 50};
    let divelectoralVotes = d3.select("#electoral-vote").classed("content", true);

    //Gets access to the div element created for this chart from HTML
    this.svgBounds = divelectoralVotes.node().getBoundingClientRect();
    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
    this.svgHeight = 150;

    //creates svg element within the div
    this.svg = divelectoralVotes.append("svg")
      .attr("width",this.svgWidth)
      .attr("height",this.svgHeight)
    ;

    this.tooltip = tooltip;

  };

  /**
   * Returns the class that needs to be assigned to an element.
   *
   * @param party an ID for the party that is being referred to.
   */
  chooseClass (party) {
    if (party == "R"){
      return "republican";
    }
    else if (party == "D"){
      return "democrat";
    }
    else if (party == "I"){
      return "independent";
    }
  }


  /**
   * Creates the stacked bar chart, text content and tool tips for electoral vote chart
   *
   * @param electionResult election data for the year selected
   * @param colorScale global quantile scale based on the winning margin between republicans and democrats
   */

  update (electionResult, colorScale){
    // console.log(electionResult);
    // let min = d3.min(electionResult, d => +d.RD_Difference);
    // let max = d3.max(electionResult, d => +d.RD_Difference);
    // console.log(`min = ${min} max = ${max}`);

    //----------------------------------------
    // Sort results and gather statistics
    //----------------------------------------
    electionResult = electionResult.sort((a,b) => {
      if (a.State_Winner == 'I' && b.State_Winner == 'I') {
        return (+a.RD_Difference) - (+b.RD_Difference)
      }
      if (a.State_Winner == 'I') {
        return -1;
      }
      if (b.State_Winner == 'I') {
        return 1;
      }
      return (+a.RD_Difference) - (+b.RD_Difference)
    });

    const totalEV = d3.sum(electionResult, d => +d.Total_EV);
    const IEV = d3.sum(electionResult.filter(d => d.State_Winner=='I'),
                       d => +d.Total_EV);
    const DEV = d3.sum(electionResult.filter(d => d.State_Winner=='D'),
                       d => +d.Total_EV);
    const REV = d3.sum(electionResult.filter(d => d.State_Winner=='R'),
                       d => +d.Total_EV);
    const EVarray = [ { pos:0, num:IEV, theclass:'I' },
                      { pos:IEV, num:DEV, theclass:'D' },
                      { pos:-1, num:REV, theclass:'R' } ];

    //----------------------------------------
    // Add rectangles. Maintain a position to
    // build the stacked bar chart.
    //----------------------------------------

    let rects = this.svg.selectAll('rect')
      .data(electionResult)
    ;

    const barHeight = 30;
    const bary = 50;
    let f = this.svgWidth / totalEV;
    let pos = 0;
    rects
      .enter()
      .append('rect')
      .merge(rects)
      .attr('x', d => {
        let ret = pos;
        pos += f*(+d.Total_EV);
        return ret;
      })
      .attr('y', bary)
      .attr('width', d => {
        return f*(+d.Total_EV);
      })
      .attr('height', barHeight)
      .attr('stroke-width', 1)
      .attr('fill', d => {
        if (d.State_Winner == 'I') {
          return 'green';
        }
        return colorScale(+d.RD_Difference)
      })
      .classed('electoralVotes', true)
      .on("mouseover", d => {
        this.tooltip.mouseover(d);
      })
      .on("mousemove", () => {
        this.tooltip.mousemove();
      })
      .on("mouseout", () => {
        this.tooltip.mouseout();
      })
    ;

    //----------------------------------------
    // Add a centerline
    //----------------------------------------
    let centerline = this.svg.selectAll('#evcenterline')
      .data([1]);
    centerline
      .enter()
      .append('line')
      .merge(centerline)
      .attr('x1', this.svgWidth/2)
      .attr('y1', bary-5)
      .attr('x2', this.svgWidth/2)
      .attr('y2', bary+barHeight+5)
      .attr('stroke', 'black')
      .attr('id', 'evcenterline')
    ;

    //----------------------------------------
    // Text: # needed to win
    //----------------------------------------
    let needed = totalEV/2;
    if (needed == Math.ceil(needed)) {
      needed += 1;
    } else {
      needed = Math.ceil(needed);
    }
    let centertext = this.svg.selectAll('#evcentertext')
      .data([1]);
    centertext
      .enter()
      .append('text')
      .merge(centertext)
      .attr('x', this.svgWidth/2)
      .attr('y', bary-20)
      .text(`Electoral vote (${needed} needed to win)`)
      .attr('text-anchor', 'middle')
      .classed('electoralVoteText', true)
      .attr('id', 'evcentertext')
    ;

    //----------------------------------------
    // Text: # votes won
    //----------------------------------------
    let EVtext = this.svg.selectAll('#evtext')
      .data(EVarray);
    EVtext
      .enter()
      .append('text')
      .merge(EVtext)
      .attr('x', d => d.pos > -1 ? f*d.pos : this.svgWidth)
      .attr('y', bary-20)
      .text(d => d.num > 0 ? d.num : '')
      // .attr('text-anchor',  d => d.pos==-1 ? 'end' : 'start')
      // .attr('font-size', '24px')
      .attr('class', d=>this.chooseClass(d.theclass))
      .classed('electoralVoteText', true)
      .attr('id', 'evtext')
    ;

    let brush = d3.brushX()
      .extent([[0, bary-10], [this.svgWidth, bary+barHeight+10]])
      .on("end", () => {
        let x0 = d3.event.selection[0];
        let x1 = d3.event.selection[1];
        let rects = this.svg.selectAll('rect.electoralVotes')
        let selected = [];
        rects.each(function(d) {
          let start = +d3.select(this).attr('x');
          let end = start + +d3.select(this).attr('width');
          if ((start >= x0 && start <= x1) ||
              (end >= x0 && end <= x1) ||
              (x0 >= start && x1 <= end)) {
            selected.push(d);
          }
        });
        this.shiftChart.update(selected);
      })
    ;

    this.svg.append("g").attr("class", "brush").call(brush);

    // ******* TODO: PART II *******

    //Group the states based on the winning party for the state;
    //then sort them based on the margin of victory

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .electoralVotes class to style your bars.

    //Display total count of electoral votes won by the Democrat and Republican party
    //on top of the corresponding groups of bars.
    //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.

  };

  
}
