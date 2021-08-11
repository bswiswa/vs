import React from "react";
import jsPDF from "jspdf";
import { Button, FormControl, Col, Row} from "react-bootstrap";
import convert from "../util/convert";


const ActionBar = (props) => {
    let { text, libz, textBackup, mode, doc_name } = props;
    let { setMode, setTextBackup, setText, handleDocNameChange, handleSave } = props;
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
        const doc = new jsPDF();
        // at a font size of 12 we can have 30 lines with 90 char each
        doc.setFontSize(12);
        // replace the italicized quotes with regular quotes
        var words = text.replaceAll(/\n/g, '\n ').replaceAll('“', '"').replaceAll('”', '"').split(" ");
        var page_line_count = 0, line_character_count = 0, str = "", i = 0;
        if(words.length > 0)
        {
            while(i < words.length){
                str = "";
                while((i < words.length) && (line_character_count + words[i].length < 90)){
                    line_character_count += (words[i].length + 1)
                    str += (str.length > 0 ? (" " + words[i]) : words[i]); // if start of line add no space
                    if(words[i].indexOf('\n') !== -1){
                        str = str.trimEnd();
                        i++;
                        break;
                    }
                    i++;
                }
                if (page_line_count > 0 && page_line_count % 30 === 0){
                    doc.addPage();
                    page_line_count = 0;
                }
                doc.text(str, 10, (page_line_count%30)*10 + 10);
                page_line_count++;
                line_character_count = 0;
            }
            doc.save(`${doc_name} Contract.pdf`);
        }
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