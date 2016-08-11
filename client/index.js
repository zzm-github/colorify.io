(function() {

var sourceEditor,
    resultEditor,
    languageSelect,
    updateBtn;

CodeMirror.modeURL = "./codemirror/mode/%N/%N.js";

function query(selector) {
    return document.querySelector(selector);
}

var syncTimer;
function sync() {
    if(syncTimer) return;
    setTimeout(function() {
        syncTimer = null;
        var code = sourceEditor.doc.getValue();
        var embedContent = query('.embed-content');
        if(code) {
            embedContent.style.visibility = 'visible';
        } else {
            embedContent.style.display = 'hidden';
        }
        resultEditor.doc.setValue(code);
    }, 100);
}

function init() {

    languageSelect = query('#language-select');
    updateBtn = query('#btn-update');
    updateBtn.addEventListener('click', sync);

    resultEditor = CodeMirror.fromTextArea(query('#result-ta'), {
        lineNumbers: true,
        readOnly: 'nocursor'
    });
    sourceEditor = CodeMirror.fromTextArea(query("#editor-ta"), {
        lineNumbers: true
    });
    sourceEditor.on('update', sync);

    initLanguages();
}

function initLanguages() {
    // fill language options
    CodeMirror.modeInfo.forEach(function(mode) {
        var option = document.createElement('option');
        option.innerText = mode.name;
        option.value = mode.mode;
        languageSelect.appendChild(option);
    });

    // auto width
    var langHiddenSelect = query('#language-hidden-select');
    var langHiddenOption = langHiddenSelect.querySelector('option');
    languageSelect.addEventListener('change', function() {
        langHiddenOption.innerText = getSelectedLanguage(true);
        languageSelect.style.width = (langHiddenSelect.clientWidth+5) + 'px';
    });

    // load mode
    languageSelect.addEventListener('change', function() {
        var language = getSelectedLanguage().toLowerCase();
        sourceEditor.setOption('mode', language);
        resultEditor.setOption('mode', language);
        CodeMirror.autoLoadMode(sourceEditor, language);
        CodeMirror.autoLoadMode(resultEditor, language);
    });
}

function getSelectedLanguage(isName) {
    var option = languageSelect.options[languageSelect.selectedIndex];
    return isName ? option.innerText : option.value;
}

window.addEventListener('load', init);

})();
