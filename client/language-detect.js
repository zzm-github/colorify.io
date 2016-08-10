(function() {

    window.languageDetect = languageDetect;

    var languageDetectFuncs;

    function languageDetect(snippet) {
        if("Worker" in window) {

        } else {
            
        }
    };



    languageDetectFuncs = {
        HTML: /^\<\!DOCTYPE html\>/ig,
        CSS: /test/ig
        Javascript: /function/ig
    };

})();
