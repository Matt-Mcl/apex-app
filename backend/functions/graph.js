module.exports = {
  async createGraph(collection, label) {  
    const data = await collection.find().toArray();
    const scores = data.map(item => item.score);
    const dates = data.map(item => new Date(parseInt(item._id.toString().substring(0, 8), 16) * 1000).toLocaleString('en-GB', { hour12: false, timeZone: 'Europe/London' }));

    return({
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: label,
          borderColor: 'rgb(255, 0, 0)',
          data: scores,
        }],
      },
    });
  },
}
