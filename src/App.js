import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Editor from "./components/Editor";
import Draft from "./components/Draft";
import LibzEditor from "./components/LibzEditor";
import { Container, Col, Row, Button, Navbar } from "react-bootstrap";
import { useState } from "react";

function App() {
  let [libz, setLibz] = useState([]);
  let [text, setText] = useState([]);
  let [mode, setMode] = useState("template");

  const addToText = (txt, type) => {
      setText([...text, { type, payload: txt }]);
  }

  const getLibz = (txt) => {
    let arr = txt.split(/({{|}})/);
    console.log(arr);
    let possibleMatch = false, libzSet = new Set();
    for(let i=0; i < arr.length; i++){
      let str = arr[i].trim();
      if (str === "{{"){
        possibleMatch = true;
        continue;
      }
      else if(possibleMatch && str !== "" && str !== "}}") // better variable format detection next time
      {
        libzSet.add(str);
      }
      else{
        possibleMatch = false;
      }
    }
    let result = [];
    for (txt of libzSet){
      result.push(txt);
    }
    console.log(result);
    return result;
  }

  const updateLibz = (txt) => {
    let uniqueLibz = new Set([...libz, ...getLibz(txt)]);
    console.log(uniqueLibz);
    let result = [];
    for (let node of uniqueLibz)
      result.push(node);
    console.log(result);
    setLibz(result);
  };

  const handleAddParagraph = (txt) => {
    if (txt.length > 0){
      addToText(txt, "paragraph");
      updateLibz(txt);
    }
  };

  const handleAddHeader = (txt) => {
    if (txt.length > 0){
      addToText(txt, "header");
      updateLibz(txt);
    }
  }

  return (
    <div className="App">
      <Navbar bg="light" variant="light">
        <Navbar.Brand href="#home">Victor-Spoilz</Navbar.Brand>
          <Button 
            variant={mode === "template" ? "outline-primary": "outline-success"} id="change-mode"
            onClick={() => setMode(mode === "template" ? "contract" : "template")}
          >
            {mode === "template" ? "Create Contract" : "Create template"}
          </Button>
      </Navbar>
      <Container>
        <Row>
          <Col>
            <LibzEditor 
              libz={libz}
              setLibz={setLibz}
              text={text}
              setText={setText}
              mode={mode}/>
          </Col>
          <Col>
            <Draft text={text} mode={mode}/>
          </Col>
        </Row>
        {mode === "template" ? 
        <Row>
          <Editor
            onAddParagraph={handleAddParagraph}
            onAddHeader={handleAddHeader}
          />
        </Row>
        : null}
        
      </Container>
      
    </div>
  );
}

export default App;
