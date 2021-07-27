import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router";
import Editor from "./Editor";
import Draft from "./Draft";
import LibzEditor from "./LibzEditor";
import ActionBar from "./ActionBar";
import { Container, Col, Row } from "react-bootstrap";

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
    this.handleDocNameChange = this.handleDocNameChange.bind(this);

    this.state = {
      libz: new Map(),
      text: "",
      textBackup: "",
      mode: "template",
      doc_name: ""
    }
  };
  
  setLibz(libz) { this.setState({ libz })}
  setText(text) { this.setState({ text })}
  setTextBackup(textBackup) { this.setState({ textBackup })}
  setMode(mode) { this.setState({ mode })}
  setDocName(doc_name) { this.setState({ doc_name})}

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
          doc_name: response.data.doc_name,
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

  handleDocNameChange(e){
    this.setDocName(e.target.value);
  }

  handleSave(e) {
    e.preventDefault();
    var { text, doc_name } = this.state;
    if(this.props.history.location.pathname.indexOf("/template/") >= 0)
    {
      // we are in the edit context so need to update record
      if(doc_name)
      {
          axios
          .post("http://localhost:3001/template/update/" + this.props.match.params.id, {doc_name, text})
          .then((res) =>  { alert("template saved"); console.log(res.data); });
  
          this.props.history.push("/");
      }
    }
    else{
      // we are in the create context so need to add a new record when post is sent to /template/add
        if(doc_name)
        {
            axios
            .post("http://localhost:3001/template/add", {doc_name, text})
            .then((res) =>  { alert(`${doc_name} saved`); console.log(res.data); });
        }
      } 

  }

  render () {
    let  { mode, text, libz, textBackup, doc_name } = this.state;
      return (
      <Container>
        <ActionBar 
          mode={mode} 
          text={text} 
          libz={libz} 
          textBackup={textBackup}
          setText={this.setText}
          setTextBackup={this.setTextBackup}
          setMode={this.setMode}
          doc_name={doc_name}
          handleDocNameChange={this.handleDocNameChange}
          handleSave={this.handleSave}
        />
        <div className="mt-1">
          <Row>
            <Col>
              <Draft 
                text={text} 
                mode={mode}
                doc_name={doc_name}
                handleSave={this.handleSave}
                handleDocNameChange={this.handleDocNameChange}
              />
            </Col>
            <Col>
              <LibzEditor 
                libz={libz}
                setLibz={this.setLibz}
                mode={mode}
                text={mode === "template" ? this.state.text : this.state.textBackup}
                textBackup={textBackup}
                setText={this.setText}
                />
            </Col>
          </Row>
          {mode === "template" ? 
          <Row>
            <Editor
              handleTextUpdate={this.handleTextUpdate}
              setText={this.setText}
              text={text}
            />
          </Row>
        : null}
        </div>
      </Container>
    );
  }
}

export default withRouter(Edit);
