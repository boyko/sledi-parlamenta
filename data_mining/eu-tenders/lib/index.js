
exports = module.exports = function () {
    return {
        request: require('./request'),
        parse: require('./parse'),
        scrape: require('./scrape'),
        w: require('./write')
    };
};
