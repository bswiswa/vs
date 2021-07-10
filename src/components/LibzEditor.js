import "../styles/LibzEditor.css";

const LibzEditor = ({libz}) => {
    console.log(libz);
    let libzElements = libz.map((libzName, index) => {
            return <li key={index}>{libzName}</li>;
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