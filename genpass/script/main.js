require.config({
    paths: {
        "crypto-js": "../../lib/dist/crypto-js",
        "utils": "../../lib/utils",
        "lib": "../../lib",
        "jquery": "../../lib/dist/jquery/jquery-2.1.0.min",
        "script": "./",
    },
});

require([
    "script/genpass",
    "script/color-hash",
    "utils/Range",
    "utils/Keycodes",
    "utils/FlashNotification",
    "jquery",
    "utils/Array",
], function(Genpass, ColorHash, Range, Keycodes, Flash, $) {
    var $salt = $("#salt"),
        $secret = $("#secret"),
        $result = $("#result"),
        $length = $("#length"),
        $chars = $(".allowedCharacters"),
        $showPassword = $("#show-password"),
        $clearPassword = $("#clear-clipboard"),
        flasher = new Flash({ container: $("#flash-messages") }),
        colorHasher = new ColorHash(),
        generator = new Genpass({
            length: $("#length").val(),
            allowedCharacters: (function() {
                var codes = [];

                $chars.each(function(i,e) {
                    var ranges = Range.ranges($(e).val());
                    $(e).data("ranges", ranges);

                    if (e.checked) {
                        codes = codes.merge(ranges.map(function(r) {
                            return r.toCodeArray();
                        }).reduce(function(a,b) {
                            return a.merge(b);
                        }));
                    }
                });

                return codes;
            })(),
        });

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
     * Workaround for android chrome bug - default keyboard can't tab to next field.
     *
     * So instead, we make <Enter>, <Return>, and <KP_Return> focus the next empty field or regenerate the password.
     */
    $salt.on("keypress.submit", function (event) {
        switch (event.which) {
            case Keycodes.ENTER:
                if ($secret.val()) {
                    $result.focus();
                } else {
                    $secret.focus();
                }
                break;
        }
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
        }).on("blur.generate", function(event) {
            $(this).css("background-image", colorHasher.generate($(this).val()));
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
                    $clearPassword.click();
                    $result.val("");
                    $secret.val("").blur();
                    $salt.val("").focus();
                    break;

                case Keycodes.X:
                    $clearPassword.click();
                    break;

                case Keycodes.V:
                    $showPassword.click();
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
     * Shows the generated password in a human-readable font.
     */
    $showPassword.on("click.show", function(event) {
        $result.toggleClass("show");
    });

    /**
     * Clears the generated password and clipboard
     */
    $clearPassword.on("click.clear", event => {
        copyToClipboard("").then(() => {
            flasher.info("Cleared clipboard");
            if (window.getSelection) {
                window.getSelection().empty();
            }
        }).catch(err => {
            console.debug("Couldn't clear clipboard", err);
        });
    });

    /**
     * Called when the key needs to be regenerated.
     *
     * Populates `#result` and selects the value.
     */
    function generate() {
        if (!$salt.val() || !$secret.val()) {
            return;
        }

        let generated = generator.generate($salt.val(), $secret.val());

        $result.val(generated);
        $result.select();
        copyToClipboard(generated).then(() => {
            flasher.info("Copied to clipboard");
        }).catch(err => {
            console.debug("Couldn't write value to clipboard.", err);
        });
    }

    function copyToClipboard(str) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(str);
        }

        return new Promise((resolve, reject) => {
            let handler = $(document).one('copy', e => {
                // Have to put _something_ in the clipboard for old browsers
                // or the whole execCommand fails.
                e.originalEvent.clipboardData.setData('text/plain', str || " ");
                e.preventDefault();
            });

            if (document.execCommand('copy')) {
                resolve();
            } else {
                reject("exectCommand returned false");
            }
        });
    }
});
