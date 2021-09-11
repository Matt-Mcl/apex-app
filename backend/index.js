const express = require("express");
const graph = require("./functions/graph.js");
const fetch = require('node-fetch');
const path = require('path');
const cors = require('cors')
const {MongoClient} = require('mongodb');
require('dotenv').config({ path: `${__dirname}/.env` });

// Setup Mongo client
const mongoClient = new MongoClient('mongodb://127.0.0.1:27017');
mongoClient.connect(() => {
  console.log(`MongoDB client connected`);
  getApexData();
});

const apexdb = mongoClient.db('apexdb');
const rankScoreData = apexdb.collection('rankScoreData');
const arenaScoreData = apexdb.collection('arenaScoreData');

// Setup webserver
const app = express();
const PORT = 8081;
app.use(cors());

let apexAPIStatus = 200;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../frontend/build')));

app.get('/rankgraph', async (req, res) => res.send(await graph.rankGraph(apexdb)));

// All other GET requests not handled before will return the React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

function updateStatus(newStatus) {
  if (apexAPIStatus !== newStatus) {
    apexAPIStatus = newStatus;  
    console.log(`Apex API status changed to ${apexAPIStatus}`);
  }
}

// Track apex legends stats API every 10 seconds
async function getApexData() {
  const response = await fetch(`https://api.mozambiquehe.re/bridge?version=5&platform=PC&player=${process.env.APEXNAME}&auth=${process.env.APEXAPIKEY}`);

  // If the API doesn't return successfully, pause requests for 1 minute.
  if (response.status !== 200) {
    updateStatus(response.status);
    return setTimeout(getApexData, 60 * 1000);
  }

  updateStatus(200);
  
  const text = await response.json();

  const lastRankScore = (await rankScoreData.find().limit(1).sort({$natural:-1}).toArray())[0]['score'];

  const globalRank = text['global']['rank'];

  let rankScore = globalRank['rankScore'];
  let rankName = globalRank['rankName'];
  let rankDiv = globalRank['rankDiv'];
  let rankImg = globalRank['rankImg'];
  let rankedSeason = globalRank['rankedSeason'];
  
  if (lastRankScore !== rankScore) {
    rankScoreData.insertOne({ score: rankScore, name: rankName, div: rankDiv, img: rankImg, season: rankedSeason })
    console.log('Logged: ',{ score: rankScore, name: rankName, div: rankDiv, img: rankImg, season: rankedSeason })
  }

  const lastAreaScore = (await arenaScoreData.find().limit(1).sort({$natural:-1}).toArray())[0]['score'];

  const globalArena = text['global']['arena'];

  rankScore = globalArena['rankScore'];
  rankName = globalArena['rankName'];
  rankDiv = globalArena['rankDiv'];
  rankImg = globalArena['rankImg'];
  rankedSeason = globalArena['rankedSeason'];

  if (lastAreaScore !== rankScore) {
    arenaScoreData.insertOne({ score: rankScore, name: rankName, div: rankDiv, img: rankImg, season: rankedSeason })
    console.log('Logged: ',{ score: rankScore, name: rankName, div: rankDiv, img: rankImg, season: rankedSeason })
  }
  setTimeout(getApexData, 10 * 1000);
}
