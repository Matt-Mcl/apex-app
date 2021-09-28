import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import CreateChart from "./CreateChart.js";

async function getSeasons() {
  const response = await fetch(`${process.env.REACT_APP_API_SERVER}/getrankseasons`);
  const json = await response.json();
  return json
}

class RankGraph extends Component {
  constructor() {
    super();
    this.state = { currentSeason: "", seasons: [], graphData: "" };
    this.handleSeasonChange = this.handleSeasonChange.bind(this);
  }

  async componentDidMount() {
    const seasons = await getSeasons();
    this.setState({ seasons: seasons })
    this.getGraph(seasons[0]);
  }

  handleSeasonChange(event) {
    if (event.target.value) this.getGraph(event.target.value);
  }

  async getGraph(newSeason) {
    const response = await fetch(`${process.env.REACT_APP_API_SERVER}/getrankgraph?season=${newSeason}`);
    const json = await response.json();
    this.setState({ currentSeason: newSeason, graphData: json });
  }

  render() {
    return (
      <>
        <Form style={{marginBottom: "16px"}}>
          <Row>
            <Col xs="auto">
              <Form.Label>Season:</Form.Label>
              <Form.Select value={this.state.currentSeason} onChange={this.handleSeasonChange}>
                {this.state.seasons.map(item => {
                  return(<option key={item} value={item}>{item}</option>);
                })}
              </Form.Select>
            </Col>
          </Row>
        </Form>
        <CreateChart graphData={this.state.graphData} />
      </>
    );
  }
}

export default RankGraph;
