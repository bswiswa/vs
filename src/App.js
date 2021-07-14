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
  let [textBackup, setTextBackup] = useState([]);
  let [libzIndex, setlibzIndex] = useState([]);
  let [libzValuesBackup, setLibzValuesBackup] = useState([]);
  let [mode, setMode] = useState("template");

  const addToText = (txt, type) => {
      setText([...text, { type, payload: txt }]);
  }

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

  const handleAddPageBreak = (txt) => {
      addToText(txt, "page break");
  }

  const convert = (str, newstr, previous) => {
    // return an evaluated template string
    const replacer = (match, p1, p2, p3) => {
        var replacement =  p2 === previous ?  newstr : p2;
        return [p1, replacement, p3].join("");
    }
    var regex = new RegExp(`([^(${previous})]*)(${previous})([^(${previous})]*)`, "g");
    str = str.replace(regex, replacer);
    return str;
  }

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
                  text.forEach(({payload}) => { 
                    var matches = payload.match(/{{[^({})]*}}/g);
                    if (matches)
                      libzInText = [...libzInText, ...matches]; 
                  });
                  var indices = libzInText.map(lib => {
                    var name = lib.substring(2, lib.length - 2);
                    return libz.indexOf(name);
                  });
                  setlibzIndex(indices);
                  setMode("contract");

                  // substitute in libz values
                  let txt = [...text];
                  var libzCounter = 0;
                  txt = txt.map(({type, payload}) => {
                      let libzArray = payload.match(/{{[^({})]*}}/g);
                      if(libzArray){
                          libzArray.forEach(current_libz => {
                              let val = libzValuesBackup[libzIndex[libzCounter]];
                              payload = val === "" || val === undefined ? payload : convert(payload, val, current_libz);
                              libzCounter++;
                          });
                      }
                      return { type, payload };
                  });
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
              <Draft text={text} mode={mode}/>
            </Col>
            <Col>
              <LibzEditor 
                libz={libz}
                setLibz={setLibz}
                libzIndex={libzIndex}
                libzValuesBackup={libzValuesBackup}
                setLibzValuesBackup={setLibzValuesBackup}
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
              onAddParagraph={handleAddParagraph}
              onAddHeader={handleAddHeader}
              onAddPageBreak={handleAddPageBreak}
            />
          </Row>
        : null}
        </div>
      </Container>
      
    </div>
  );
}

export default App;
