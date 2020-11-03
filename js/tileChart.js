
/** Class implementing the tileChart. */
class TileChart {

  /**
   * Initializes the svg elements required to lay the tiles
   * and to populate the legend.
   */
  constructor(tooltip){

    let divTiles = d3.select("#tiles").classed("content", true);
    this.margin = {top: 30, right: 20, bottom: 30, left: 50};
    //Gets access to the div element created for this chart and legend element from HTML
    let svgBounds = divTiles.node().getBoundingClientRect();
    this.svgWidth = svgBounds.width - this.margin.left - this.margin.right;
    this.svgHeight = this.svgWidth/2;
    let legendHeight = 150;
    //add the svg to the div
    let legend = d3.select("#legend").classed("content",true);

    //creates svg elements within the div
    this.legendSvg = legend.append("svg")
      .attr("width",this.svgWidth)
      .attr("height",legendHeight)
      .attr("transform", "translate(" + this.margin.left + ",0)")
    this.svg = divTiles.append("svg")
      .attr("width",this.svgWidth)
      .attr("height",this.svgHeight)
      .attr("transform", "translate(" + this.margin.left + ",0)")

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
    else if (party== "D"){
      return "democrat";
    }
    else if (party == "I"){
      return "independent";
    }
  }

  /**
   * Creates tiles and tool tip for each state, legend for encoding the color scale information.
   *
   * @param electionResult election data for the year selected
   * @param colorScale global quantile scale based on the winning margin between republicans and democrats
   */
  update (electionResult, colorScale){

    //Calculates the maximum number of columns to be laid out on the svg
    // this.maxColumns = d3.max(electionResult,function(d){
    //   return parseInt(d["Space"]);
    // });

    // //Calculates the maximum number of rows to be laid out on the svg
    // this.maxRows = d3.max(electionResult,function(d){
    //   return parseInt(d["Row"]);
    // });

    this.maxColumns = d3.max(electionResult, d => +d.Space) + 1;
    this.maxRows = d3.max(electionResult, d => +d.Row) + 1;

    let w = this.svgWidth/this.maxColumns;
    let h = this.svgHeight/this.maxRows;

    // console.log(electionResult);
    // console.log(this.maxColumns);
    // console.log(this.maxRows);

    this.svg.html('');
    this.svg.selectAll('rect')
      .data(electionResult)
      .enter()
      .append('rect')
      .attr('x', d => w*d.Space)
      .attr('y', d => h*d.Row)
      .attr('width', w)
      .attr('height', h)
      .attr('stroke-width', 1)
      .attr('class', d=>this.chooseClass(d.State_Winner))
      .style('fill', d => colorScale(+d.RD_Difference))
      .classed('tile', true)
      // .on("mouseover", d => {
      //   this.tooltip.set(this.tooltip_html(d), true);
      // })
      // .on("mousemove", () => {
      //   this.tooltip.setPosition();
      // })
      // .on("mouseout", () => {
      //   this.tooltip.set('', false);
      // })
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

    //--------------------------------------------------
    // State abbreviation
    //--------------------------------------------------
    this.svg.selectAll('#tilename')
      .data(electionResult)
      .enter()
      .append('text')
      .attr('x', d => w*d.Space + w/2)
      .attr('y', d => h*d.Row + h/2)
      .attr('dy', '-.5em')
      .text(d => `${d.Abbreviation}`)
      .attr('text-anchor', 'middle')
      .classed('tilestext', true)
      .attr('id', 'tilename')
      .attr('pointer-events', 'none')
    ;

    //--------------------------------------------------
    // # electoral votes
    //--------------------------------------------------
    this.svg.selectAll('#tileev')
      .data(electionResult)
      .enter()
      .append('text')
      .attr('x', d => w*d.Space + w/2)
      .attr('y', d => h*d.Row + h/2)
      .attr('dy', '1em')
      .text(d => `${d.Total_EV}`)
      .attr('text-anchor', 'middle')
      .classed('tilestext', true)
      .attr('id', 'tileev')
      .attr('pointer-events', 'none')
    ;












    // TODO fix this
    // // Creates a legend element and assigns a scale that needs
    // // to be visualized
    // this.legendSvg.append("g")
    //   .attr("class", "legendQuantile")
    //   .attr("transform", "translate(0,50)");

    // let legendQuantile = d3.legendColor()
    //   .shapeWidth(100)
    //   .cells(10)
    //   .orient('horizontal')
    //   .scale(colorScale);

    // this.legendSvg.select(".legendQuantile")
    //   .call(legendQuantile);

    // console.log(d3.tip()
    //   .attr('class', 'd3-tip'));

    // //for reference:https://github.com/Caged/d3-tip
    // //Use this tool tip element to handle any hover over the chart
    // let tip = d3.tip()
    //   .attr('class', 'd3-tip')
    //   // .direction('se')
    //   // .offset(function() {
    //   //   return [0,0];
    //   // })
    //   .html((d)=>{
    //     /* populate data in the following format
    //      * tooltip_data = {
    //      * "state": State,
    //      * "winner":d.State_Winner
    //      * "electoralVotes" : Total_EV
    //      * "result":[
    //      * {"nominee": D_Nominee_prop,"votecount": D_Votes,"percentage": D_Percentage,"party":"D"} ,
    //      * {"nominee": R_Nominee_prop,"votecount": R_Votes,"percentage": R_Percentage,"party":"R"} ,
    //      * {"nominee": I_Nominee_prop,"votecount": I_Votes,"percentage": I_Percentage,"party":"I"}
    //      * ]
    //      * }
    //      * pass this as an argument to the tooltip_render function then,
    //      * return the HTML content returned from that method.
    //      * */
    //     return ;
    //   });

    // ******* TODO: PART IV *******
    //Tansform the legend element to appear in the center and make a call to this element for it to display.

    //Lay rectangles corresponding to each state according to the 'row' and 'column' information in the data.

    //Display the state abbreviation and number of electoral votes on each of these rectangles

    //Use global color scale to color code the tiles.

    //HINT: Use .tile class to style your tiles;
    // .tilestext to style the text corresponding to tiles

    //Call the tool tip on hover over the tiles to display stateName, count of electoral votes
    //then, vote percentage and number of votes won by each party.
    //HINT: Use the .republican, .democrat and .independent classes to style your elements.
    
  };


}
