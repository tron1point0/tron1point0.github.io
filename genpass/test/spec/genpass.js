describe("Genpass", function () {
    var instance, Genpass;

    beforeAll(function(done) {
        require(["lib/genpass"], function(module) {
            Genpass = module;
            done();
        });
    });

    beforeEach(function () {
        instance = new Genpass();
    });

    it("can generate passwords", function () {
        expect(instance.generate("foo", "bar")).toEqual("X5XYX6SGu6V2j43h");
    });

    it("can increment length", function () {
        instance.increment();

        expect(instance.generate("foo", "bar")).toEqual("X5XYX6SGu6V2j43hU");

        instance.increment(2);

        expect(instance.generate("foo", "bar")).toEqual("X5XYX6SGu6V2j43hU6a");
    });

    it("can decrement length", function () {
        instance.decrement();

        expect(instance.generate("foo", "bar")).toEqual("X5XYX6SGu6V2j43");

        instance.decrement(2);

        expect(instance.generate("foo", "bar")).toEqual("X5XYX6SGu6V2j");
    });

    it("can set the length", function() {
        instance.setLength(8);

        expect(instance.generate("foo", "bar")).toEqual("X5XYX6SG");

        instance.setLength(16);

        expect(instance.generate("foo", "bar")).toEqual("X5XYX6SGu6V2j43h");
    });

    it("can add characters", function () {
        instance.addCharacter(" ");

        expect(instance.generate("foo", "bar")).toEqual("T2TUV4QFr1S0f3 d");

        instance.addRange("[!-/]");

        expect(instance.generate("foo", "bar")).toEqual("lZlm1q,084zmx$Hv");
    });

    it("can remove characters", function () {
        instance.removeCharacter("9");

        expect(instance.generate("foo", "bar")).toEqual("b7bcZ7UHxBY3n46l");

        instance.removeRange("[0-9]");

        expect(instance.generate("foo", "bar")).toEqual("LZLMrQmQYuzMXEhV");
    });
});
