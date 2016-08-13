(function() {

var sourceEditor,
    resultEditor,
    languageSelect,
    updateBtn,
    saveBtn;

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
function save() {
    var code = sourceEditor.doc.getValue();
    if(!code) return;

    var html = query('.embed-content .CodeMirror-scroll').outerHTML.trim().replace('\n', '');
    var html = template('#embedTemplate', { body: html });

    $.ajax({
        url: '/save',
        type: 'POST',
        data: {
            html: html,
            code: code
        },
        success: function(result) {
            if(result.success) {
                history.pushState({}, document.title, result.hash);
                query('#link').value = location.href + ".html";
                toast('success', 'Save OK!');
            }
        },
        error: function() {
            toast('fail', 'Save Fail!');
        }
    });
}

function init() {

    languageSelect = query('#language-select');
    updateBtn = query('#btn-update');
    updateBtn.addEventListener('click', sync);
    saveBtn = query('#btn-save');
    saveBtn.addEventListener('click', save);

    var resultTa = query('#result-ta');
    resultEditor = CodeMirror.fromTextArea(resultTa, {
        lineNumbers: true,
        readOnly: 'nocursor'
    });
    resultTa.parentNode.removeChild(resultTa);
    sourceEditor = CodeMirror.fromTextArea(query("#editor-ta"), {
        lineNumbers: true
    });
    sourceEditor.on('update', sync);

    initLanguages();
    initCode();
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

function initCode() {
    $.get('/code' + location.pathname, function(result) {
        sourceEditor.setValue(result);
    });
}

function getSelectedLanguage(isName) {
    var option = languageSelect.options[languageSelect.selectedIndex];
    return isName ? option.innerText : option.value;
}

function template(id, data) {
    var tpl = query(id).innerHTML;
    for(var i in data) {
        tpl = tpl.replace(new RegExp('{{' + i + '}}', 'ig'), data[i]);
    }
    return tpl;
}

function toast(type, text) {
    var html = template('#toastTpl', {
        type: type,
        text: type === 'success' ? '☺ ' + text : '☢ ' + text
    });
    var toast = $(html);
    toast.appendTo(document.body);
    setTimeout(function() {
        toast.css('opacity', 1);
    }, 1);
    setTimeout(function() {
        toast.css('opacity', 0);
        setTimeout(function() {
            toast.remove();
        }, 600);
    }, 1600);
}

window.addEventListener('load', init);

})();
