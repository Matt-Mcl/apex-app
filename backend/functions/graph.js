function createGraph(dates, scores) {
  return({
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Ranked Data',
        borderColor: 'rgb(255, 0, 0)',
        data: scores,
      }],
    },
  });
}

module.exports = {
  async rankGraph(apexdb) {
    const rankScoreData = apexdb.collection('rankScoreData');
  
    const data = await rankScoreData.find().toArray();
    const scores = data.map(item => item.score);
    const dates = data.map(item => new Date(parseInt(item._id.toString().substring(0, 8), 16) * 1000).toLocaleString('en-GB', { hour12: false, timeZone: 'Europe/London' }));

    return({
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Ranked Data',
          borderColor: 'rgb(255, 0, 0)',
          data: scores,
        }],
      },
    });
  }
}
