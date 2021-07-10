import { useState } from "react";
import { Container, Row, Form, Button } from "react-bootstrap";
import '../styles/Editor.css';

const Editor = ({ onAddParagraph, onAddHeader }) => {
    const [editorText, setEditorText] = useState("");
    console.log(editorText);
    return (
        <Container>
            <Row className="justify-content-center mt-5" id="editorActions">
                <Button 
                    variant="outline-primary" className="mr-1" size="sm"
                    onClick={() => { 
                        onAddParagraph(editorText);
                        setEditorText("");
                    }}
                    >+Paragraph</Button>{' '}
                <Button 
                    variant="outline-secondary" size="sm"
                    onClick={() => { 
                        onAddHeader(editorText);
                        setEditorText("");
                    }}
                >+Header</Button>
            </Row>
            <Row className="justify-content-center">
                <Form.Control id="editorText" as="textarea" rows={3} 
                onChange={(e) => setEditorText(e.target.value)}
                value={editorText}
                />
            </Row>
        </Container>
    );
}

export default Editor;