exports.selectDropdownByNum = function ( el, optionNum ) {
    if (optionNum){
        el.all(by.tagName('option'))
            .then(function(options){
                options[optionNum].click();
            });
    }
};