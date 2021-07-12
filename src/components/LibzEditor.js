import "../styles/LibzEditor.css";
import {Row, Col, Form, InputGroup} from 'react-bootstrap';

const LibzEditor = ({libz, setLibz, mode, text, setText}) => {

    const handleLibzNameChange = (e) => {
        let newlibz = e.target.value;
        let previous_name_index = parseInt(e.target.getAttribute("libz-index"));
        let oldlibz = "{{" + libz[previous_name_index] + "}}";
        let txt = text;
        txt = txt.map(({type, payload}) => {
            return { type, payload: convert(payload, newlibz, oldlibz) }
        });
        setText(txt);
        let libzArr = libz;
        libzArr[previous_name_index] = newlibz;
        setLibz(libzArr);
    };

    const convert = (str, newlibz, oldlibz) => {
        // return an evaluated template string
        const replacer = (match, p1, p2, p3) => {
            var replacement =  p2 === oldlibz ? "{{" + newlibz + "}}" : p2;
            return [p1, replacement, p3].join("");
        }
        var regex = new RegExp(`([^(${oldlibz})]*)(${oldlibz})([^(${oldlibz})]*)`, "g");
        str = str.replace(regex, replacer);
        return str;
    };

    let libzElements = libz.map((libzName, index) => {
            return mode === "template" ? 
            <Form.Group as={Row} key={index} >
                <Col>
                <Form.Control type="text" placeholder={libzName} 
                    libz-index={index}
                    value={libzName}
                    onChange={handleLibzNameChange}
                />
                </Col>
            </Form.Group> :
                <InputGroup className="mb-3" key={index}>
                    <InputGroup.Prepend>
                    <InputGroup.Text>{libzName}</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control placeholder={libzName + " value"}
                        libz-index={index}
                    />
                </InputGroup>
                ;
        });

    return (
        <div id="libz-editor">
            <h5>Libz List</h5>
            <ul id="libz-list">
                {libzElements}
            </ul>
        </div>
    );
};

export default LibzEditor;