import React, { Component } from "react";
import CreateChart from "./CreateChart.js";

class RankGraph extends Component {
  constructor() {
    super();
    this.state = { graphData: null };
  }

  async componentDidMount() {
    const response = await fetch(`${process.env.REACT_APP_API_SERVER}/rankgraph`);
    const json = await response.json();
    this.setState({ graphData: json });
  }

  render() {
    return (
      <>
        <CreateChart graphData={this.state.graphData} />
      </>
    );
  }
}

export default RankGraph;
