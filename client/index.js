(function() {

var sourceEditor,
    resultEditor;

function query(selector) {
    return document.querySelector(selector);
}

function sync() {
    resultEditor.setValue(sourceEditor.getValue());
}

function init() {
    sourceEditor = CodeMirror.fromTextArea(query("#editor-ta"), {
        lineNumbers: true
    });

    resultEditor = CodeMirror.fromTextArea(query("#result-ta"), {
        lineNumbers: true,
        readOnly: true
    });

    query('#btn-run').addEventListener('click', function() {
        sync();
    });
    window.sourceEditor = sourceEditor;
}

window.addEventListener('load', init);

})();
