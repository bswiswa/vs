import "../styles/Draft.css";
import MarkdownView from "react-showdown";
import convert from "../util/convert";
import colorPicker from "../util/colorPicker";

const Draft = ({ text }) => {
    const highlightLibz = (txt) => {
        let libzArray = txt.match(/{{[^({})]*}}/g);
        if(libzArray){

            libzArray.forEach(current_libz => {
                // format the appearance of the libz
                let val = `<span style='background-color: ${colorPicker(current_libz.length)}; border-radius: 5px; padding: 2px; font-weight: bold;'>` + current_libz.substring(2, current_libz.length - 2) + "</span>";
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

    return (
        <div id="draft">
            {draftElements}
        </div>         
    );
}

export default Draft;