class Tooltip {

  constructor() {
    //----------------------------------------
    // tooltip
    //----------------------------------------
    this.tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      // .attr("opacity", 0)
      .style("background", "#FFFFFF")
      .attr('id', 'tooltip')
      .classed('tooltipDiv', true)
    ;
    // this.tooltip
    //   .append('svg')
    //   .attr('width', 50)
    //   .attr('height', 50)
    //   .append('rect')
    //   .attr('x', 0)
    //   .attr('y', 0)
    //   .attr('width', 50)
    //   .attr('height', 50)
    //   .attr('fill', 'red')
    // ;
  };

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
   * Gets the HTML content for a tool tip.
   */
  tooltip_html(d) {
    let text = "<h2 class ="  + this.chooseClass(d.State_Winner) +
      " >" + d.State + "</h2>";
    text +=  "Electoral Votes: " + d.Total_EV;
    text += "<ul>"
    // Democrat
    text += "<li class = democrat>" +
      d.D_Nominee_prop+":\t\t"+d.D_Votes+"("+d.D_Percentage+"%)" + "</li>"
    // Republican
    text += "<li class = republican>" +
      d.R_Nominee_prop+":\t\t"+d.R_Votes+"("+d.R_Percentage+"%)" + "</li>"
    // Independent
    if (d.I_Percentage) {
      text += "<li class = independent>" +
        d.I_Nominee_prop+":\t\t"+d.I_Votes+"("+d.I_Percentage+"%)" + "</li>"
    }
    text += "</ul>";

    return text;
  }

  mouseover(d) {
    // this.set(this.tooltip_html(d), true);
    this.tooltip
      .html(this.tooltip_html(d))
      .classed('tooltip-title', true)
    ;
    this.tooltip.style("visibility", "visible");
  }

  mousemove(d) {
    // this.setPosition();
    this.tooltip.style("top", (d3.event.pageY-10)+"px")
      .style("left",(d3.event.pageX+10)+"px");
  }

  mouseout(d) {
    this.tooltip.style("visibility", "hidden");
  }

  // set(text, visible) {
  //   this.tooltip
  //     .html(text)
  //     .classed('tooltip-title', true)
  //   ;
  //   // this.tooltip
  //   //   .html('')
  //   // ;
  //   // this.tooltip
  //   //   .append('svg')
  //   //   .attr('width', 50)
  //   //   .attr('height', 50)
  //   //   .append('text')
  //   //   .text(text)
  //   //   .attr('y', 0)
  //   //   .attr('width', 50)
  //   //   .attr('height', 50)
  //   //   .attr('fill', 'red')
  //   // ;
  //   this.tooltip.style("visibility", visible?"visible":"hidden");
  // };

  // mouseMove(event) {
  //   this.tooltip.style("top", (d3.event.pageY-10)+"px")
  //     .style("left",(d3.event.pageX+10)+"px");
  // };

};
