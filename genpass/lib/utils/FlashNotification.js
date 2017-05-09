define(["jquery"], function($) {
    const DEFAULT_DURATION = 2000,
        DEFAULT_TYPE = "info";

    /**
     * Flashes ephemeral messages to the screen.
     *
     * Configure with {@code options}:
     *
     *  {@code container}: the DOM node or jQuery object to append the flash messages to
     *
     * @param {Object} options
     * @return {FlashNotification} itself
     * @constructor
     */
    function FlashNotification(options) {
        options = options || {};

        this.container = $(options.container || document.body);
        this.duration = options.duration || DEFAULT_DURATION;

        return this;
    };

    /**
     * The valid types of notifications that can be flashed.
     *
     * @type {[String]}
     */
    FlashNotification.types = ["info", "warning", "error"];

    /**
     * Flash a message on the screen.
     *
     * @param {String} message Message to show.
     * @param {FlashNotification.types} [type] The type of notification to show. Defaults to {@code info}.
     * @param {Number} [duration] Length of time the message should be visible. Defaults to 2 seconds.
     * @return {Node} DOM node of the flashed message.
     */
    FlashNotification.prototype.flash = function(message, type, duration) {
        if (typeof type === "number") {
            duration = type;
            type = DEFAULT_TYPE;
        }

        type = type || DEFAULT_TYPE;
        duration = duration || this.duration;

        var $flash = $("<div>")
            .text(message)
            .addClass(type);

        this.container.append($flash);

        setTimeout(function() {
            $flash.remove();
        }, duration);

        return $flash.get(0);
    };

    FlashNotification.types.forEach(function(t) {
        FlashNotification.prototype[t] = function(message, duration) {
            return this.flash(message, t, duration);
        }
    });

    return FlashNotification;
});
