define(function() {
    var Selection = {
        selectContentsWebkit: function webkit(element) {
            var selection = window.getSelection(),
                range = document.createRange();
            range.selectNodeContents(element);
            selection.removeAllRanges();
            selection.addRange(range);
        },

        selectContentsIE: function ie(element) {
            var range = document.body.createTextRange();
            range.moveToElementText($result.get());
            range.select();
        },

        /**
         * Selects all text contents of `element`.
         *
         * @param {Node} element DOM node to select.
         */
        // Populated by the browser detection below
        selectContents: function(element) {},
    };

    if (window.getSelection && document.createRange) {
        // Chrome, Edge, Firefox, IE >= 9, Opera, and Safari
        Selection.selectContents = Selection.selectContentsWebkit;
    } else if (document.body.createTextRange) {
        // For IE < 9 and Opera < 10.1
        Selection.selectContents = Selection.selectContentsIE;
    }

    return Selection;
});
