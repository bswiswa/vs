import "../styles/Draft.css";
import {Button, Row} from "react-bootstrap";
import html2pdf from "html-to-pdf-js";

const Draft = ({ text, mode }) => {
    console.log(text);
    let draftElements = text.map(({type, payload}, index) => {
        if (type === "header")
            return <h5 key={index}>{payload}</h5>;
        else if (type === "paragraph")
            return <p key={index}>{payload}</p>;
        else if (type === "page break")
            return <p key={index} className="new-page"></p>;
        else
            return <p key={index}>{payload}</p>;
    });

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