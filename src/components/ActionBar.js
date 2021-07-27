import React from "react";
import html2pdf from "html-to-pdf-js";
import { Button, FormControl, Col, Row} from "react-bootstrap";
import convert from "../util/convert";

const ActionBar = (props) => {
    let { text, libz, textBackup, mode, setMode, setTextBackup, setText, doc_name, handleDocNameChange, handleSave } = props;
    const handleModeSwitch = () => {
        if(mode === "template") {
            // backup the text
            setTextBackup(text);
            setMode("contract");
            // substitute in libz values
            let txt = (' ' + text).slice(1); // https://stackoverflow.com/questions/31712808/how-to-force-javascript-to-deep-copy-a-string
            if(libz.size > 0){
                for (const [key, val] of libz) {
                    txt = !val ? txt : convert(txt, val, `{{${key}}}`);
                }
            }
            setText(txt);
          }
          else {
            // return to the text that we previously had before substituting in the libz
            setText(textBackup);
            setMode("template");
          } 
    };

    const downloadPdf = () => {
        // cycle through the elements and selectively add the page break class
        var parent = document.querySelector("div#draft > div");
        var height = 0, pageHeight = 1500;
        parent.querySelectorAll("*").forEach(el => {
            var sum = height + el.offsetHeight;
            if (sum > pageHeight){
                el.classList.add("new-page");
                height = el.offsetHeight;
            }
            else {
                height = sum;
            }
            console.log("temp height = " + height);
        });
        var opt = {
            margin:       0.3,
            filename:     'contract.pdf',
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
            pagebreak:    { mode: 'css', before: '.new-page'}
          };
        html2pdf().set(opt).from(parent).save();
        console.log("final height = " + height);
    }

    return (
    <Row className="justify-content-end mt-1">
        <Col>
            <FormControl
                    type="search"
                    placeholder={mode === "template" ? "Enter Template Name" : "Enter Contract Name"}
                    value={!doc_name ? "" : doc_name}
                    onChange={handleDocNameChange}
                    aria-label="Search"
                />
        </Col>
        <Col className="d-flex justify-content-start">
            { 
                text.length > 0 ? 
                    <Button 
                        variant="outline-primary" 
                        id="change-mode"
                        onClick={handleSave}
                        className="mr-2"
                        >
                        Save {mode === "template" ? "Template" : "Contract"}
                    </Button> : null 
            }
            { 
                mode === "contract" && 
                    <Button 
                        variant="outline-primary"
                        id="change-mode"
                        onClick={downloadPdf}
                        className="mr-2"
                        >
                        Download PDF
                    </Button>
            }
            <Button 
                variant={mode === "template" ? "outline-primary": "outline-success"} id="change-mode"
                onClick={handleModeSwitch}
                className="text-nowrap flex-fill"
                >
                {mode === "template" ? "Switch to Contract Mode" : "Switch to Template Mode"}
            </Button>
        </Col>
      </Row>
    );
}

export default ActionBar;