import "../styles/LibzEditor.css";
import {Row, Col, Form, InputGroup} from 'react-bootstrap';
import {useState} from "react";

const LibzEditor = ({libz, setLibz, libzIndex, mode, text, setText, textBackup }) => {
    let [libzValues, setLibzValues] = useState(libz.map(el => ""));
    const convert = (str, newstr, previous) => {
        // return an evaluated template string
        const replacer = (match, p1, p2, p3) => {
            var replacement =  p2 === previous ?  newstr : p2;
            return [p1, replacement, p3].join("");
        }
        var regex = new RegExp(`([^(${previous})]*)(${previous})([^(${previous})]*)`, "g");
        str = str.replace(regex, replacer);
        return str;
    };

    const handleLibzNameChange = (e) => {
        let newlibz = e.target.value;
        let previous_name_index = parseInt(e.target.getAttribute("libz-index"));
        let oldlibz = "{{" + libz[previous_name_index] + "}}";
        let txt = [...text];
        txt = txt.map(({type, payload}) => {
            return { type, payload: convert(payload, "{{" + newlibz + "}}", oldlibz) }
        });
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
        setLibzValues(tmpLibzValues);
        let txt = [...textBackup];
        var libzCounter = 0;
        txt = txt.map(({type, payload}) => {
            let libzArray = payload.match(/{{[^({})]*}}/g);
            console.log(libzArray);
            if(libzArray){
                libzArray.forEach(current_libz => {
                    let val = tmpLibzValues[libzIndex[libzCounter]];
                    payload = val === "" || val === undefined ? payload : convert(payload, val, current_libz);
                    libzCounter++;
                });
            }
            console.log({type, payload});
            return { type, payload };
        });
        setText(txt);
    }

    // const handleLibzValueChangeBulk = (e) => {
    //     document.querySelectorAll();
    //     let new_replacement = e.target.value;
    //     let libz_index = parseInt(e.target.getAttribute("libz-index"));
    //     let current_libz = "{{" + libz[libz_index] + "}}";
    //     let txt = [...text];
    //     txt = txt.map(({type, payload}) => {
    //         return { type, payload: convert(payload, new_replacement, current_libz) }
    //     });
    //     setText(txt);
    // }

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
                        onChange={handleLibzValueChange}
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