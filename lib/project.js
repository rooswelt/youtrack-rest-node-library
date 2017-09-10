var q = require('q');

var url;
var self;


module.exports.defaults = function (_self, _url) {
    url = _url;
    self = _self;
};

module.exports.getProject = function (projectId) {
    var d = q.defer();

    self.request.get({ url: url + '/rest/admin/project/' + projectId }, function (err, res, body) {
        _handleError(err, cb, d);

        if (cb) return cb(res, body);
        d.resolve(res, body);
    });
    return d.promise;
};

module.exports.getProjectIds = function () {
    var d = q.defer();

    self.request.get({ url: url + '/rest/admin/project/' }, function (err, res, body) {
        _handleError(err, cb, d);

        if (cb) return cb(res, body);
        d.resolve(res, body);
    });
    return d.promise;

};

module.exports.getSubsystem = function (projectId, name) { };
module.exports.getSubsystems = function (projectId) { };
module.exports.getVersions = function (projectId) { };
module.exports.getBuilds = function (projectId) { };

function _handleError(err, cb, deferred) {
    if (err || res.statusCode !== 200) {
        console.error(res.statusCode);
        err = err || new Error('wrong credentials');

        if (cb) return cb(err);
    }
    deferred.reject(err);
}