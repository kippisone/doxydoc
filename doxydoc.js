var path = require('path');

exports.DoxyDocParser = require('./modules/doxydocParser');
exports.DoxyDocPage = require('./modules/pageCreator');

exports.templateDirs = {
    'lagoon': path.join(__dirname, 'templates/lagoon/'),
    'deep-space': path.join(__dirname, 'templates/deep-space')
};