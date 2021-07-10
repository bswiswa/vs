import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Editor from "./components/Editor";
import Draft from "./components/Draft";
import LibzEditor from "./components/LibzEditor";
import { Container, Col, Row } from "react-bootstrap";
import { useState } from "react";

function App() {
  let [libz, setLibz] = useState([]);
  let [text, setText] = useState([]);

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
      <Container>
        <Row>
          <Col>
            <LibzEditor libz={libz}/>
          </Col>
          <Col>
            <Draft text={text}/>
          </Col>
        </Row>
        <Row>
          <Editor
            onAddParagraph={handleAddParagraph}
            onAddHeader={handleAddHeader}
          />
        </Row>
      </Container>
      
    </div>
  );
}

export default App;
