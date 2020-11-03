let tooltip = new Tooltip();

let votePercentageChart = new VotePercentageChart(tooltip);

let tileChart = new TileChart(tooltip);

let shiftChart = new ShiftChart();

let electoralVoteChart = new ElectoralVoteChart(shiftChart, tooltip);


let globalDict = new Object();

// Load the data corresponding to all the election years.
// Pass this data and instances of all the charts that update on year
// selection to yearChart's constructor.
d3.csv("data/state-position.csv", function(positionData) {
  positionData.row = +positionData.Row;
  positionData.col = +positionData.Column;
  return positionData;
}).then(positionData => {

  globalDict = new Object();
  d3.csv("data/scrubbed.csv", function(entry){
    date = entry.datePosted;
    let year = date.substring(date.length-4, date.length);
    // console.log(year);
    if(!globalDict.hasOwnProperty(year)){
      globalDict[year] = new Object();
    }
  }).then(entry =>{
    console.log(globalDict)
    console.log(positionData);
      //Domain definition for global color scale
      let domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];

      //Color range for global color scale
      let range = ["#063e78", "#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#860308"];

    colorScale = d3.scaleQuantile()
          .domain(domain)
          .range(range);

    tileChart.update(positionData, colorScale);

    // let yearChart = new YearChart(electoralVoteChart, tileChart,
                                  // votePercentageChart, alldata);
    // yearChart.update();

    // let s = d3.select('#y2012');
    // yearChart.selectYear(s, s.data()[0]);
  });
});
