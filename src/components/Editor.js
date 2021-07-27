import { Container, Row, Form } from "react-bootstrap";
import '../styles/Editor.css';

const Editor = ({ handleTextUpdate,text }) => {
    return (
        <Container>
            <Row className="justify-content-center mt-3">
                <Form.Control id="editorText" as="textarea" rows={9}
                    placeholder="Begin creating your template here" 
                    onChange={(e) => handleTextUpdate(e.target.value)}
                    value={text}
                    autoFocus
                />
            </Row>
        </Container>
    );
}

export default Editor;