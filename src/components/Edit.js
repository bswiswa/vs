import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router";
import Editor from "./Editor";
import Draft from "./Draft";
import LibzEditor from "./LibzEditor";
import { Container, Col, Row, Button, Navbar } from "react-bootstrap";
import convert from "../util/convert";

class Edit extends Component {

  constructor(props){
    super(props);
    this.getLibz = this.getLibz.bind(this);
    this.handleTextUpdate = this.handleTextUpdate.bind(this);
    this.setLibz = this.setLibz.bind(this);
    this.setText = this.setText.bind(this);
    this.setTextBackup = this.setTextBackup.bind(this);
    this.setMode = this.setMode.bind(this);
    this.handleSave = this.handleSave.bind(this);

    this.state = {
      libz: new Map(),
      text: "",
      textBackup: "",
      mode: "template",
      name: ""
    }
  };
  
  setLibz(libz) { this.setState({ libz })}
  setText(text) { this.setState({ text })}
  setTextBackup(textBackup) { this.setState({ textBackup })}
  setMode(mode) { this.setState({ mode })}

  // This will get the template based on the id from the database.
  componentDidMount() {
    console.log("pathname=" + this.props.history.location.pathname);
    if(this.props.history.location.pathname.indexOf("/template/") >= 0)
    {
      console.log("current pathname = " + this.props.history.location.pathname);
      console.log("current match params id = " + this.props.match.params.id);
      // using the edit context so need to pull data from db
      axios
      .get("http://localhost:3001/template/" + this.props.match.params.id)
      .then((response) => {
        this.setState({
          name: response.data.name,
          text: response.data.text,
        });
        this.setLibz(this.getLibz(response.data.text));
        
      })
      .catch(function (error) {
        console.log(error);
      });
    }
    // do nothing if we are in the create context
  }

  // get a map of all libz
  getLibz(txt) {
    let all_libz = txt.match(/{{[^({})]*}}/g);
    let libz_set = new Set(all_libz);
    let result = new Map();  
    for (const lib of libz_set){
      // get val from {{val}}
      result.set(lib.substring(2,lib.length - 2), '');
    }
    return result;
  }

  handleTextUpdate(txt) {
      this.setLibz(this.getLibz(txt));
      this.setText(txt);
  };

  handleSave(e) {
    e.preventDefault();
    var name;
    if(this.props.history.location.pathname.indexOf("/template/") >= 0)
    {
      // we are in the edit context so need to update record
      name = prompt("Edit template name:", this.state.name);
      if(name != null)
      {
          axios
          .post("http://localhost:3001/template/update/" + this.props.match.params.id, {name, text: this.state.text})
          .then((res) =>  { alert("template saved"); console.log(res.data); });
  
          this.props.history.push("/");
      }
    }
    else{
      // we are in the create context so need to add a new record when post is sent to /template/add
      name = prompt("Enter a template name:");
        if(name != null)
        {
            axios
            .post("http://localhost:3001/template/add", {name, text: this.state.text})
            .then((res) =>  { alert("template saved"); console.log(res.data); });
        }
      } 

  }

  render () {
      return (
      <Container>
          <Navbar>
          {this.state.name ? <h6>Template: {this.state.name}</h6> : null}
          <Navbar.Collapse className="justify-content-end">
            <Button 
                variant={this.state.mode === "template" ? "outline-primary": "outline-success"} id="change-mode"
                onClick={() => {
                  if(this.state.mode === "template") {
                    // backup the text
                    this.setTextBackup(this.state.text);
                    this.setMode("contract");

                    // substitute in libz values
                    let txt = (' ' + this.state.text).slice(1); // https://stackoverflow.com/questions/31712808/how-to-force-javascript-to-deep-copy-a-string
                    var libz = this.state.libz;
                    if(libz.size > 0){
                        for (const [key, val] of libz) {
                            txt = !val ? txt : convert(txt, val, `{{${key}}}`);
                        }
                    }
                    this.setText(txt);
                  }
                  else {
                    // return to the text that we previously had before substituting in the libz
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

export default withRouter(Edit);
