describe("Flash Notification", function() {
    var FlashNotification, $;

    beforeAll(function(done) {
        require(["utils/FlashNotification", "jquery"], function(definition, jQuery) {
            FlashNotification = definition;
            $ = jQuery;
            done();
        });
    });

    it("can be created with default values", function() {
        var instance = new FlashNotification();

        expect(instance).toBeTruthy();
        expect(instance.container.get(0)).toBe(document.body);
        expect(instance.duration).toBe(2000);
    });

    it("can override defaults", function() {
        var a = {},
            b = {},
            instance = new FlashNotification({
                container: a,
                duration: b,
            });

        expect(instance.container).toEqual($(a));
        expect(instance.duration).toBe(b);
    });

    describe("with timers", function() {
        var instance, mockedNode;

        beforeEach(function() {
            jasmine.clock().install();

            instance = new FlashNotification();
            mockedNode = mockAppend(instance);
        });

        afterEach(function () {
            jasmine.clock().uninstall();
        });

        it("defaults message type to info", function() {
            instance.flash("message");

            expect(mockedNode.hasClass("info")).toBe(true);
        });

        it("defaults duration to 2 seconds", function() {
            instance.flash("message");

            jasmine.clock().tick(1999);

            expect(mockedNode.remove).not.toHaveBeenCalled();

            jasmine.clock().tick(1);

            expect(mockedNode.remove).toHaveBeenCalled();
        });

        it("defaults to info type when called with a duration", function() {
            instance.flash("message", 4000);

            expect(mockedNode.hasClass("info")).toBe(true);
        });

        it("can flash for a different duration", function() {
            instance.flash("message", 4000);

            jasmine.clock().tick(3999);

            expect(mockedNode.remove).not.toHaveBeenCalled();

            jasmine.clock().tick(1);

            expect(mockedNode.remove).toHaveBeenCalled();
        });

        it("can flash an info message", function() {
            instance.info("message");

            expectFlashed("message", "info", 2000);
        });

        it("can flash a warning message", function() {
            instance.warning("message");

            expectFlashed("message", "warning", 2000);
        });

        it("can flash an error message", function() {
            instance.error("message");

            expectFlashed("message", "error", 2000);
        });

        function expectFlashed(message, type, duration) {
            expect(mockedNode.text()).toBe(message);
            expect(mockedNode.hasClass(type)).toBe(true);
            expect(mockedNode.hasClass("show")).toBe(false);

            jasmine.clock().tick(duration - 1);

            expect(mockedNode.remove).not.toHaveBeenCalled();

            jasmine.clock().tick(1);

            expect(mockedNode.remove).toHaveBeenCalled();
        }

        function mockAppend(instance) {
            spyOn(instance.container, "append").and.callFake(function(node) {
                mockedNode = node;
                spyOn(mockedNode,"remove");
            });

            return mockedNode;
        }
    });
});
