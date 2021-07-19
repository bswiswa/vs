import "../styles/Draft.css";
import {Button, Row} from "react-bootstrap";
import html2pdf from "html-to-pdf-js";
import MarkdownView from "react-showdown";
import convert from "../util/convert";

const Draft = ({ text, mode }) => {
    const highlightLibz = (txt) => {
        let libzArray = txt.match(/{{[^({})]*}}/g);
                  if(libzArray){
                      libzArray.forEach(current_libz => {
                          let val = "**" + current_libz + "**";
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
            <div id="draft">
                <div>
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
                    </Button> : null
                }
            </Row>
            
        </div>
        
        
        
    );
}

export default Draft;