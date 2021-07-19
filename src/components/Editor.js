import { useState } from "react";
import { Container, Row, Form, Button } from "react-bootstrap";
import '../styles/Editor.css';

const Editor = ({ onAddParagraph, onAddHeader }) => {
    const [editorText, setEditorText] = useState("");
    console.log(editorText);
    return (
        <Container>
            <Row className="justify-content-left mt-5 mb-1" id="editorActions">
                <Button 
                    variant="outline-secondary" size="sm" className="mr-1"
                    onClick={() => { 
                        onAddHeader(editorText);
                        setEditorText("");
                    }}
                >+Header</Button>{' '}
                <Button 
                    variant="outline-primary" className="mr-1" size="sm"
                    onClick={() => { 
                        onAddParagraph(editorText);
                        setEditorText("");
                    }}
                    >+Paragraph</Button>{' '}
            </Row>
            <Row className="justify-content-center">
                <Form.Control id="editorText" as="textarea" rows={3}
                    placeholder="Begin creating your template here" 
                    onChange={(e) => { 
                        var val = e.target.value;
                        if(val.length > 0)
                        {
                            if(val.charAt(val.length-1) === '\n'){
                                val = val.substring(0,val.length-1);
                                onAddParagraph(val);
                                setEditorText("");
                            }
                            else
                                setEditorText(val);
                        }
                        
                    }}
                    value={editorText}
                    autoFocus
                />
            </Row>
        </Container>
    );
}

export default Editor;