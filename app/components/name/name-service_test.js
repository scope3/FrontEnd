describe('Unit test name service', function() {
    var svc,
        shortName = "Emissions to air, unspecified";

    beforeEach(module('lcaApp.name'));

    beforeEach(inject(function(_NameService_) {
        svc = _NameService_;
    }));

    it('should have been injected', function() {
        expect(svc).toBeDefined();
    });

    it('should not change a short name', function() {
        expect(svc.shorten(shortName, 30)).toEqual(shortName);
    });

    it('should shorten a long name with punctuation', function() {
        var name = shortName + ", gobbledygook";

        expect(svc.shorten(name, 30)).toEqual(shortName);
    });

    it('should shorten a long name with no punctuation', function() {
        var shortName = "A string with 27 characters",
            longName = shortName + " followed by gobbledygook";

        expect(svc.shorten(longName, 30)).toEqual(shortName);
    });

});