/** Class implementing the votePercentageChart. */
class VotePercentageChart {

  /**
   * Initializes the svg elements required for this chart;
   */
  constructor(tooltip){
    this.margin = {top: 30, right: 20, bottom: 30, left: 50};
    let divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

    //fetch the svg bounds
    this.svgBounds = divvotesPercentage.node().getBoundingClientRect();
    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
    this.svgHeight = 200;

    //add the svg to the div
    this.svg = divvotesPercentage.append("svg")
      .attr("width",this.svgWidth)
      .attr("height",this.svgHeight)

    this.tooltip = tooltip;
  }


  /**
   * Returns the class that needs to be assigned to an element.
   *
   * @param party an ID for the party that is being referred to.
   */
  chooseClass(data) {
    if (data == "R"){
      return "republican";
    }
    else if (data == "D"){
      return "democrat";
    }
    else if (data == "I"){
      return "independent";
    }
  }

  /**
   * Renders the HTML content for tool tip
   *
   * @param tooltip_data information that needs to be populated in the tool tip
   * @return text HTML content for toop tip
   */
  tooltip_render (data) {
    let text = "<ul>";
    text += "<li >" + data.shape+":\t\t"+"("+data.percentage+"%)" + "</li>";
    return text;
  }

  /**
   * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
   *
   * @param selectedYearData election data for the year selected
   */
  update (selectedYearData){

    // //for reference:https://github.com/Caged/d3-tip
    // //Use this tool tip element to handle any hover over the chart
    // let tip = d3.tip().attr('class', 'd3-tip')
    //   .direction('s')
    //   .offset(function() {
    //     return [0,0];
    //   })
    //   .html((d)=> {
    //     /* populate data in the following format
    //      * tooltip_data = {
    //      * "result":[
    //      * {"nominee": D_Nominee_prop,"votecount": D_Votes_Total,"percentage": D_PopularPercentage,"party":"D"} ,
    //      * {"nominee": R_Nominee_prop,"votecount": R_Votes_Total,"percentage": R_PopularPercentage,"party":"R"} ,
    //      * {"nominee": I_Nominee_prop,"votecount": I_Votes_Total,"percentage": I_PopularPercentage,"party":"I"}
    //      * ]
    //      * }
    //      * pass this as an argument to the tooltip_render function then,
    //      * return the HTML content returned from that method.
    //      * */
    //     return;
    //   });


    // console.log(selectedYearData);
    // let min = d3.min(selectedYearData, d => +d.RD_Difference);
    // let max = d3.max(selectedYearData, d => +d.RD_Difference);
    // console.log(`min = ${min} max = ${max}`);

    //----------------------------------------
    // Gather statistics
    //----------------------------------------
    // add up every shape for every state for the current year
    let shapes = new Object();
    let stateKeys = Object.keys(selectedYearData);
    for (let i=0; i<stateKeys.length; i++) {
      let shapeKeys = Object.keys(selectedYearData[stateKeys[i]].shapes);
      for (let j=0; j<shapeKeys.length; j++) {
        let currShape = shapeKeys[j];
        if (Object.keys(shapes).includes(currShape)) {
          shapes[currShape].count += 1;
        } else {
          shapes[currShape] = {'count': 1, 'shape': currShape};
        }
      }
    }
    console.log(shapes);
    // get a list that you can pass in to functions of this data
    let shapesList = Object.values(shapes);
    // get percentages of each shape
    let percentages = [];
    let total_count = 0;
    shapesList.forEach(function(d) {
      total_count += d.count;
    });
    shapesList.forEach(function(d) {
      percentages = percentages.concat({'shape': d.shape, 'percent': d.count/total_count});
    })
    percentages.sort((a,b) => a.percent - b.percent);
    // let Iperc = (+selectedYearData[0].I_PopularPercentage.slice(0,-1))/100;
    // let Dperc = (+selectedYearData[0].D_PopularPercentage.slice(0,-1))/100;
    // let Rperc = (+selectedYearData[0].R_PopularPercentage.slice(0,-1))/100;
    // console.log(Dperc);
    // console.log(Rperc);
    // console.log(Iperc);

    // let data = [
    //   { pos : 0, perc : Iperc, party : 'independent', anchor : 'start',
    //     candidate : selectedYearData[0].I_Nominee_prop },
    //   { pos : Iperc, perc : Dperc, party : 'democrat', anchor : 'middle',
    //     candidate : selectedYearData[0].D_Nominee_prop },
    //   { pos : Iperc+Dperc, perc : Rperc, party : 'republican', anchor : 'middle',
    //     candidate : selectedYearData[0].R_Nominee_prop},
    // ];

    //----------------------------------------
    // Add rectangles. Maintain a position to
    // build the stacked bar chart.
    //----------------------------------------

    const barHeight = 30;
    const bary = 70;
    const f = this.svgWidth / 1;

    console.log(percentages);
    console.log(total_count);
    let currentPosition = 0;
    this.svg.html('');
    this.svg.selectAll('rect')
      .data(percentages)
      .enter()
      .append('rect')
      .attr('x', function(d) {
        let tempPosition = currentPosition;
        currentPosition += f*d.percent;
        return tempPosition;
      })
      .attr('y', bary)
      .attr('width', d => f*d.percent)
      .attr('height', barHeight)
      .attr('stroke-width', 1)
      .attr('fill', d => `rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255})`)
      .classed('votesPercentage', true)
      .on("mouseover", d => {
        this.tooltip.mouseover2(d);
      })
      .on("mousemove", () => {
        this.tooltip.mousemove();
      })
      .on("mouseout", () => {
        this.tooltip.mouseout();
      });

    //----------------------------------------
    // Add a centerline
    //----------------------------------------
    //----------------------------------------
    // Text: midline
    //----------------------------------------
    // let centertext = this.svg.selectAll('#vcentertext')
    //   .data([1]);
    // centertext
    //   .enter()
    //   .append('text')
    //   .merge(centertext)
    //   .attr('x', this.svgWidth/2)
    //   .attr('y', bary-20)
    //   // .attr('stroke', 'black')
    //   .text('Popular Vote (50%)')
    //   .attr('text-anchor', 'middle')
    //   // .attr('font-size', '24px')
    //   .classed('votesPercentageText', true)
    //   .attr('id', 'vcentertext');
    //
    //----------------------------------------
    // Text: # votes won
    //----------------------------------------
    let Vtext = this.svg.selectAll('#vtext')
      .data(['0', '0.25', '0.5', '0.75', '1.0']);
    Vtext
      .enter()
      .append('text')
      .merge(Vtext)
      .attr('x', (d,i) => i==4 ?f-24 :i/4*f)
      .attr('y', bary-20)
      // .text(d => d.num > 0 ? d.num : '')
      .text(d => d)
      // .attr('text-anchor',  d => d.pos==-1 ? 'end' : 'start')
      .style('text-anchor',  d => d.anchor)
      // .attr('font-size', '24px')
      // .attr('class', d=>this.chooseClass(d.theclass))
      .classed('electoralVoteText', true)
      .attr('id', 'vtext');

    //----------------------------------------
    // Text: Candidate
    //----------------------------------------
    // let Ctext = this.svg.selectAll('#ctext')
      // .data(percentages);
    // Ctext
      // .enter()
      // .append('text')
      // .merge(Ctext)
      // .attr('x', d => d.pos > -1 ? f*(d.pos+d.perc/2) : this.svgWidth)
      // .attr('y', bary-50)
      // .text(d => d.num > 0 ? d.num : '')
      // .text(d => d.perc > 0 ? d.candidate : '')
      // .attr('text-anchor',  d => d.pos==-1 ? 'end' : 'start')
      // .style('text-anchor', d => d.anchor)
      // .attr('font-size', '24px')
      // .attr('class', d=>this.chooseClass(d.theclass))
      // .attr('class', d=>d.party)
      // .classed('electoralVoteText', true)
      // .attr('id', 'ctext')
    // ;

    // ******* TODO: PART III *******

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .votesPercentage class to style your bars.

    //Display the total percentage of votes won by each party
    //on top of the corresponding groups of bars.
    //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning details about this mark on top of this bar
    //HINT: Use .votesPercentageNote class to style this text element

    //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
    //then, vote percentage and number of votes won by each party.

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

  };


}
