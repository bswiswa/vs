import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Editor from "./components/Editor";
import Draft from "./components/Draft";
import LibzEditor from "./components/LibzEditor";
import { Container, Col, Row, Button, Navbar } from "react-bootstrap";
import { useState } from "react";
import convert from "./util/convert";

function App() {
  let [libz, setLibz] = useState([]);
  let [text, setText] = useState("");
  let [textBackup, setTextBackup] = useState("");
  let [libzIndex, setlibzIndex] = useState([]);
  let [libzValues, setLibzValues] = useState([]);
  let [mode, setMode] = useState("template");

  const getLibz = (txt) => {
    let allLibz = txt.match(/{{[^({})]*}}/g);
    let libzSet = new Set(allLibz);
    let result = [];
    for (txt of libzSet){
      // get val from {{val}}
      result.push(txt.substring(2,txt.length - 2));
    }
    console.log(result);
    return result;
  }

  const handleTextUpdate = (txt) => {
    if (txt.length > 0){
      setText(txt);
      setLibz(getLibz(txt));
    }
  };

  return (
    <div className="App">
      <Navbar bg="light" variant="light">
        <Navbar.Brand href="#home" 
          className={mode === "contract" ? "text-primary" : "text-success"}
        >
            Victor-Spoilz [{mode === "contract" ? "Contract" : "Template"}]
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Button 
              variant={mode === "template" ? "outline-primary": "outline-success"} id="change-mode"
              onClick={() => {
                if(mode === "template") {
                  // backup the text
                  setTextBackup(text);
                  // create integer index of libz
                  var libzInText = [];
                    var matches = text.match(/{{[^({})]*}}/g);
                    if (matches)
                      libzInText = [...libzInText, ...matches]; 
                  var indices = libzInText.map(lib => {
                    var name = lib.substring(2, lib.length - 2);
                    return libz.indexOf(name);
                  });
                  setlibzIndex(indices);
                  setMode("contract");

                  // substitute in libz values
                  let txt = (' ' + text).slice(1); // https://stackoverflow.com/questions/31712808/how-to-force-javascript-to-deep-copy-a-string
                  var libzCounter = 0;
                  let libzArray = txt.match(/{{[^({})]*}}/g);
                  if(libzArray){
                      libzArray.forEach(current_libz => {
                          let val = libzValues[libzIndex[libzCounter]];
                          txt = val === "" || val === undefined ? txt : convert(txt, val, current_libz);
                          libzCounter++;
                      });
                  }
                  setText(txt);
                }
                else {
                  setText(textBackup);
                  setMode("template");
                } 
              }}
            >
              {mode === "template" ? "Switch to Contract Mode" : "Switch to Template Mode"}
            </Button>
        </Navbar.Collapse>

      </Navbar>
      <Container>
        <div className="mt-1">
          <Row>
            <Col>
              <Draft 
                text={text} 
                mode={mode}
              />
            </Col>
            <Col>
              <LibzEditor 
                libz={libz}
                setLibz={setLibz}
                libzIndex={libzIndex}
                libzValues={libzValues}
                setLibzValues={setLibzValues}
                mode={mode}
                text={mode === "template" ? text : textBackup}
                textBackup={textBackup}
                setText={setText}
                />
            </Col>
          </Row>
          {mode === "template" ? 
          <Row>
            <Editor
              handleTextUpdate={handleTextUpdate}
              setText={setText}
              text={text}
            />
          </Row>
        : null}
        </div>
      </Container>
      
    </div>
  );
}

export default App;
