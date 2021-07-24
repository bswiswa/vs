import "../styles/LibzEditor.css";
import {Row, Col, Form, InputGroup} from 'react-bootstrap';
import convert from "../util/convert";

const LibzEditor = ({libz, setLibz, mode, text, setText, textBackup }) => {

    const handleLibzNameChange = (e) => {
        let new_name = !e.target.value ? "" : e.target.value;
        let previous_name = !e.target.getAttribute("libz-key") ? "" : e.target.getAttribute("libz-key");
        let txt = (' ' + text).slice(1);
        txt = convert(txt, `{{${new_name}}}`, `{{${previous_name}}}`);
        setText(txt);
        const new_libz = new Map(libz);
        // NaN is allowed in js Map
        let new_key = !new_name ? NaN : new_name;
        let old_key = !previous_name ? NaN : previous_name;
        new_libz.set(new_key, new_libz.get(old_key));
        new_libz.delete(old_key);
        setLibz(new_libz);
    };

    const handleLibzValueChange = (e) => {
        let new_value = e.target.value;
        let key = e.target.getAttribute("libz-key");
        // update map values
        //https://stackoverflow.com/questions/54152741/react-idiomatic-way-to-update-map-object-in-state
        const next_libz = new Map(libz);
        next_libz.set(key, new_value);
        let txt = (' ' + textBackup).slice(1); // create a copy of string
        for(const [key, val] of next_libz){
                 txt = !val ? txt : convert(txt, val, `{{${key}}}`);
            }
        setText(txt);
        setLibz(next_libz);
    }

    let libzElements = [];
    let index = 0;
    for (const [key, val] of libz){
            if( mode === "template" )
            libzElements.push(
                <Form.Group as={Row} key={index++} >
                    <Col>
                        <Form.Control type="text" placeholder={key} 
                            libz-key={key}
                            value={key}
                            onChange={handleLibzNameChange}
                        />
                    </Col>
                </Form.Group>); 
             else
                libzElements.push(
                    <InputGroup className="mb-3" key={index++}>
                    <InputGroup.Prepend>
                    <InputGroup.Text>{key}</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control type="text" placeholder={key + " value"}
                        libz-key={key}
                        value={!val ? "" : val}
                        onChange={handleLibzValueChange}
                    />
                </InputGroup>
                );
        }

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