import React, { Component } from "react";
import axios from "axios";
import Editor from "./Editor";
import Draft from "./Draft";
import LibzEditor from "./LibzEditor";
import { Container, Col, Row, Button, Navbar } from "react-bootstrap";
import convert from "../util/convert";

class Create extends Component {

  constructor(props){
    super(props);
    this.getLibz = this.getLibz.bind(this);
    this.handleTextUpdate = this.handleTextUpdate.bind(this);
    this.setLibz = this.setLibz.bind(this);
    this.setLibzValues = this.setLibzValues.bind(this);
    this.setLibzIndex = this.setLibzIndex.bind(this);
    this.setText = this.setText.bind(this);
    this.setTextBackup = this.setTextBackup.bind(this);
    this.setMode = this.setMode.bind(this);
    this.handleTextUpdate = this.handleTextUpdate.bind(this);
    this.handleSave = this.handleSave.bind(this);

    this.state = {
      libz: [],
      text: "",
      textBackup: "",
      libzIndex: [],
      libzValues: [],
      mode: "template"

    }
  };
  
  setLibz(libz) { this.setState({ libz })}
  setText(text) { this.setState({ text })}
  setTextBackup(textBackup) { this.setState({ textBackup })}
  setLibzIndex(libzIndex) { this.setState({ libzIndex })}
  setLibzValues(libzValues) { this.setState({ libzValues })}
  setMode(mode) { this.setState({ mode })}

  getLibz() {
    let allLibz = this.state.text.match(/{{[^({})]*}}/g);
    let libzSet = new Set(allLibz);
    let result = [];
    for (const txt of libzSet){
      // get val from {{val}}
      result.push(txt.substring(2,txt.length - 2));
    }
    console.log(result);
    return result;
  }

  handleTextUpdate(txt) {
      this.setText(txt);
      this.setLibz(this.getLibz(txt));
  }

    handleSave(e) {
        e.preventDefault();
        // add a new record when post is sent to /template/add
        var name = prompt("Enter a template name:");
        if(name != null)
        {
            axios
            .post("http://localhost:3001/template/add", {name, text: this.state.text})
            .then((res) =>  { alert("template saved"); console.log(res.data); });
        }
    }

  render () {
      return (
      <Container>
          <Navbar>
          <Navbar.Collapse className="justify-content-end">
            <Button 
                variant={this.state.mode === "template" ? "outline-primary": "outline-success"} id="change-mode"
                onClick={() => {
                  if(this.state.mode === "template") {
                    // backup the text
                    this.setTextBackup(this.state.text);
                    // create integer index of libz
                    var libzInText = [];
                      var matches = this.state.text.match(/{{[^({})]*}}/g);
                      if (matches)
                        libzInText = [...libzInText, ...matches]; 
                    var indices = libzInText.map(lib => {
                      var name = lib.substring(2, lib.length - 2);
                      return this.state.libz.indexOf(name);
                    });
                    this.setlibzIndex(indices);
                    this.setMode("contract");

                    // substitute in libz values
                    let txt = (' ' + this.state.text).slice(1); // https://stackoverflow.com/questions/31712808/how-to-force-javascript-to-deep-copy-a-string
                    var libzCounter = 0;
                    let libzArray = txt.match(/{{[^({})]*}}/g);
                    if(libzArray){
                        libzArray.forEach(current_libz => {
                            let val = this.state.libzValues[this.state.libzIndex[libzCounter]];
                            txt = val === "" || val === undefined ? txt : convert(txt, val, current_libz);
                            libzCounter++;
                        });
                    }
                    this.setText(txt);
                  }
                  else {
                    this.setText(this.state.textBackup);
                    this.setMode("template");
                  } 
                }}
              >
                {this.state.mode === "template" ? "Switch to Contract Mode" : "Switch to Template Mode"}
              </Button>
        </Navbar.Collapse>
      </Navbar>
        <div className="mt-1">
          <Row>
            <Col>
              <Draft 
                text={this.state.text} 
                mode={this.state.mode}
                handleSave={this.handleSave}
              />
            </Col>
            <Col>
              <LibzEditor 
                libz={this.state.libz}
                setLibz={this.setLibz}
                libzIndex={this.state.libzIndex}
                libzValues={this.state.libzValues}
                setLibzValues={this.setLibzValues}
                mode={this.state.mode}
                text={this.state.mode === "template" ? this.state.text : this.state.textBackup}
                textBackup={this.state.textBackup}
                setText={this.setText}
                />
            </Col>
          </Row>
          {this.state.mode === "template" ? 
          <Row>
            <Editor
              handleTextUpdate={this.handleTextUpdate}
              setText={this.setText}
              text={this.state.text}
            />
          </Row>
        : null}
        </div>
      </Container>
    );
  }
}

export default Create;
