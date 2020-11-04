let tooltip = new Tooltip();

let barChart = new BarChart();

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
    if(entry.country==="us"){
      date = entry.datePosted;
      year = date.substring(date.length-4, date.length);
      // console.log(year);
      if(!globalDict.hasOwnProperty(year)){
        globalDict[year] = {};
      }

      currentYearDict = globalDict[year];

      // making sure the state is in the dict
      state = entry.state;
      if(!currentYearDict.hasOwnProperty(state)){
        currentYearDict[state] = {"sightings":[], "shapes":{}, "words":""};
      }

      currentYearStateDict = currentYearDict[state];

      // pushing the current sighting to the dict
      currentYearStateDict.sightings.push(entry);


      // adding current shape to the dictionary or incrementing its count
      curShape = entry.shape;
      if(!currentYearStateDict.shapes.hasOwnProperty(curShape)){
        currentYearStateDict.shapes[curShape] = 1;
      }
      else{
        currentYearStateDict.shapes[curShape] += 1;
      }

      // adding words to the dictionary
      currentYearStateDict.words += entry.comments;
    }
    return entry;
  }).then(entry =>{
    console.log(globalDict);
    console.log(positionData);
      //Domain definition for global color scale
      let domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];

      //Color range for global color scale
      let range = ["#063e78", "#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#860308"];

    colorScale = d3.scaleQuantile()
          .domain(domain)
          .range(range);

    tileChart.update(positionData, colorScale, globalDict);
    barChart.update(globalDict);

    let yearChart = new YearChart(electoralVoteChart, tileChart,
                                  votePercentageChart, globalDict);
    yearChart.update();

    let s = d3.select('#y2014');
    yearChart.selectYear('2014', globalDict['2014'],s);
  });
});
