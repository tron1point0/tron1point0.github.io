require.config({
    paths: {
        "crypto-js": "../lib/dist/crypto-js",
        "utils": "../lib/utils",
        "lib": "../lib",
        "jquery": "../lib/dist/jquery/jquery-2.1.0.min"
    },
});

require([
    "lib/genpass",
    "utils/Range",
    "utils/Selection",
    "utils/Keycodes",
    "jquery",
    "utils/Array",
], function(Genpass, Range, Selection, Keycodes, $) {
    var $salt = $("#salt"),
        $secret = $("#secret"),
        $result = $("#result"),
        $placeholder = $("#result > *"),
        $length = $("#length"),
        $chars = $(".allowedCharacters"),
        $showPassword = $("#showPassword"),
        generator = new Genpass({
            length: $("#length").val(),
            allowedCharacters: (function() {
                var codes = [];

                $chars.each(function(i,e) {
                    // Pre-generate the Range objects to use in the event handler
                    $(e).data("ranges", (function() {
                        var value = $(e).val(),
                            // In case there's only one character, the `| 1` forces integer math
                            length = (value.length / 2) | 1,
                            _ret = new Array(length);

                        for (var i = 0, j = 0; i < value.length; i += 2, j++) {
                            _ret[j] = new Range(value.substring(i, i + 2));
                            if (e.checked) {
                                codes = codes.extend(_ret[j].toCodeArray());
                            }
                        }

                        return _ret;
                    })());
                });

                return codes.mergeSort();
            })(),
        });

    // TODO: XXX REMOVE
    window.GENERATOR = generator;

    /**
     * Handles clicking on the menu button.
     *
     * Show the menu on click. If the user clicks anywhere besides the menu, hide it.
     */
    $("#menuButton").on("click", function(event) {
        event.stopPropagation();

        var panel = $('#menu');

        if (!panel.hasClass("open")) {
            panel.addClass("open");

            $(document).on("click.menuButton", "#menu", function(event) {
                event.stopPropagation();
            });

            $(document).one("click.menuButton", ":not(#menu *,#menu)", function(event) {
                panel.removeClass("open");
            });

        } else {
            panel.removeClass("open");
            $(document).off("click.menuButton");
        }
    });

    /**
     * Keep the generator length identical to the value of the input field.
     */
    $length.on("change", function() {
        generator.setLength($length.val());

        generate();
    });

    /**
     * Add or remove allowed ranges when their checkboxes are clicked.
     *
     * Also regenerate password if necessary.
     */
    $chars.on("change", function() {
        var fn = this.checked ? generator.addRange : generator.removeRange;

        $(this).data("ranges").forEach(function(r) {
            fn.call(generator, r);
        });

        generate();
    });

    /**
     * Makes <Return>, <Enter>, and <KP_Return> generate the password as well as <Tab>
     */
    $secret.on("keypress.generate", function (event) {
            switch (event.which) {
                case Keycodes.ENTER:
                    $result.focus();
                    break;
            }
        });

    $result
        /**
         * Select the whole password when the user tabs to or clicks on the field. (For copy/paste.)
         */
        .on("focus.select", generate)
        /**
         * Keyboard shortcuts when the result is focused.
         */
        .on("keyup.toggles", function (event) {
            // TODO: Add a shortcuts panel.
            switch (event.which) {
                case Keycodes.UP_ARROW:
                case Keycodes.KP_ADD:
                case Keycodes.EQUAL_SIGN:
                    $length.val(parseInt($length.val()) + 1);
                    $length.change();
                    break;

                case Keycodes.DOWN_ARROW:
                case Keycodes.KP_SUBTRACT:
                    $length.val(parseInt($length.val()) - 1);
                    $length.change();
                    break;

                case Keycodes.BACKSPACE:
                case Keycodes.DELETE:
                case Keycodes.ESCAPE:
                    $salt.val("");
                    $secret.val("");
                    $result.empty();
                    $result.append($placeholder);
                    $salt.focus();
                    break;

                // TODO: Add button and enable (see main.css as well)
                case Keycodes.V:
                    $result.toggleClass("show-password");
                    break;

                // TODO: Generate from `accesskey` attribute
                case Keycodes.U:
                    $("#uppercase").click();
                    break;
                case Keycodes.L:
                    $("#lowercase").click();
                    break;
                case Keycodes.N:
                    $("#numbers").click();
                    break;
                case Keycodes.SPACE:
                    $("#space").click();
                    break;
                case Keycodes.S:
                    $("#symbols").click();
                    break;
            }
        });

    /**
     * Called when the key needs to be regenerated.
     *
     * Populates `#result` and selects the value.
     */
    function generate() {
        if ($salt.val() && $secret.val()) {
            $placeholder.detach();
            $result.text(generator.generate($salt.val(), $secret.val()));
            Selection.selectContents($result.get(0));
        }

        // TODO: Copy to clipboard
    }
});
