import "../styles/Draft.css";
import {Button, Row, Form, InputGroup} from "react-bootstrap";
import html2pdf from "html-to-pdf-js";
import MarkdownView from "react-showdown";
import convert from "../util/convert";
import colorPicker from "../util/colorPicker";

const Draft = ({ text, mode, handleSave, doc_name, handleDocNameChange }) => {
    const highlightLibz = (txt) => {
        let libzArray = txt.match(/{{[^({})]*}}/g);
        if(libzArray){

            libzArray.forEach(current_libz => {
                // format the appearance of the libz
                let val = `<span style='background-color: ${colorPicker(current_libz.length)}; border-radius: 5px; padding: 2px; font-weight: bold;'>` + current_libz.substring(2, current_libz.length - 2) + "</span>";
                txt = val === "" || val === undefined ? txt : convert(txt, val, current_libz);
            });
        }
        return txt;
    }
    let txt = highlightLibz((' ' + text).slice(1));
    let draftElements = <MarkdownView 
                            markdown={txt}
                            options={{ simpleLineBreaks: true, noHeaderId: true, underline: true }}
                        />;

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
        <div>
            <div>
                <InputGroup className="mx-0 my-0 px-0 py-0">
                <InputGroup.Prepend>
                    <InputGroup.Text>{mode === "template" ? "Template" : "Contract"}{' '}Name</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control type="text" 
                    placeholder={mode === "template" ? "Template Name" : "Contract Name"}
                    value={!doc_name ? "" : doc_name}
                    onChange={handleDocNameChange}
                />
              </InputGroup>
            <div id="draft">
                    {draftElements}
                </div>
            </div>
            <Row className="justify-content-center">
                {
                mode === "contract" ? 
                    <Button variant="outline-primary"
                        className="mt-1"
                        onClick={downloadPdf}
                    >
                        Download
                    </Button> : 
                    text.length > 0 ? <Button variant="outline-success"
                    className="mt-1"
                    onClick={handleSave}
                >
                    Save Template
                </Button> : null
                }
            </Row>
            
        </div>
        
        
        
    );
}

export default Draft;