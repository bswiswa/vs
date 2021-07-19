import "../styles/LibzEditor.css";
import {Row, Col, Form, InputGroup} from 'react-bootstrap';
import convert from "../util/convert";

const LibzEditor = ({libz, setLibz, libzIndex, libzValues, setLibzValues, mode, text, setText, textBackup }) => {

    const handleLibzNameChange = (e) => {
        let newlibz = e.target.value;
        let previous_name_index = parseInt(e.target.getAttribute("libz-index"));
        let oldlibz = "{{" + libz[previous_name_index] + "}}";
        let txt = (' ' + text).slice(1);
        txt = convert(txt, "{{" + newlibz + "}}", oldlibz);
        setText(txt);
        let libzArr = libz;
        libzArr[previous_name_index] = newlibz;
        setLibz(libzArr);
    };

    const handleLibzValueChange = (e) => {
        let new_replacement = e.target.value;
        let libz_index = parseInt(e.target.getAttribute("libz-index"));
        let tmpLibzValues = [...libzValues];
        tmpLibzValues[libz_index] = new_replacement;
        //setLibzValues(tmpLibzValues);
        setLibzValues(tmpLibzValues);
        let txt = (' ' + textBackup).slice(1); // create a copy of string
        var libzCounter = 0;
        let libzArray = txt.match(/{{[^({})]*}}/g);
        console.log(libzArray);
        if(libzArray){
            libzArray.forEach(current_libz => {
                let val = tmpLibzValues[libzIndex[libzCounter]];
                 txt = val === "" || val === undefined ? txt : convert(txt, val, current_libz);
                libzCounter++;
            });
        }
        setText(txt);
    }

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
                    <Form.Control type="text" placeholder={libzName + " value"}
                        libz-index={index}
                        value={libzValues[index] ? libzValues[index] : ""}
                        onChange={handleLibzValueChange}
                    />
                </InputGroup>
                ;
        });

    return (
        <div id="libz-editor">
            {libz.length > 0 ? <h5>Libz Editor</h5> : null}
            <ul id="libz-list">
                {libzElements}
            </ul>
        </div>
    );
};

export default LibzEditor;