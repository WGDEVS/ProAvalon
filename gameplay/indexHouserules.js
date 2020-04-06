// borrowed from ProAvalon\gameplay\avalon\indexCards.js

function index() {
    // Import all the houserules
    this.getHouserules = function (thisRoom) {
        const normalizedPath = require('path').join(__dirname, './houserules');

        const houseruleImports = {};
        const obj = {};

        require('fs').readdirSync(normalizedPath).forEach((file) => {
            // console.log(file);

            if (file.includes('.js') === true) {
                name = file.replace('.js', '');

                houseruleImports[name] = require(`./houserules/${file}`);
            }
        });


        for (var name in houseruleImports) {
            if (houseruleImports.hasOwnProperty(name)) {
                // Initialise it
                obj[name] = new houseruleImports[name](thisRoom);
            }
        }

        return obj;
    };
}

module.exports = index;
