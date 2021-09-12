import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import RankGraph from "./RankGraph";
import ArenaGraph from "./ArenaGraph";

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'

function App() {
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>Apex App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/rankgraph">Rank Graph</Nav.Link>
              <Nav.Link href="/arenagraph">Arena Graph</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container style={{marginTop: "16px"}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rankgraph" element={<RankGraph />} />
          <Route path="/arenagraph" element={<ArenaGraph />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
