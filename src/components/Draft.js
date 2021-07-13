import "../styles/Draft.css";
import {Button, Row} from "react-bootstrap";
import html2pdf from "html-to-pdf-js";

const Draft = ({ text, mode }) => {
    let draftElements = text.map(({type, payload}, index) => {
        if (type === "header")
            return <h5 key={index}>{payload}</h5>;
        else if (type === "paragraph")
            return <p key={index}>{payload}</p>;
        else
            return <p key={index}>{payload}</p>;
    });

    const downloadPdf = () => {
        var el = document.getElementById("draft");
        html2pdf(el);
    }

    return (
        <div>
            <div id="draft">
                {draftElements}
            </div>
            <Row className="justify-content-center">
                {
                mode === "contract" ? 
                    <Button variant="outline-primary"
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