var q = require('q');
var _ = require('lodash');
var Client = require('node-rest-client').Client;

var client = new Client();
client.parsers.find("XML").options = { "explicitArray": false, "ignoreAttrs": false, "mergeAttrs": true };
var token;

module.exports.init = function (_url, _token) {
    url = _url;
    token = _token;
    client.registerMethod('getProjects', _url + "/rest/admin/project", "GET");
    client.registerMethod('getProject', _url + "/rest/admin/project/${projectId}", "GET");
};

module.exports.getProjectIDs = function () {
    return _getProjectIds();
}

module.exports.getProjects = function () {
    var deferred = q.defer();
    _getProjectIds().then(function (projectIds) {
        var promises = [];
        _.each(projectIds, function (projectId) {
            promises.push(_getProject(projectId));
        });
        q.all(promises).then(function (projects) {
            deferred.resolve(projects);
        })
    }, function (error) {
        deferred.reject(error);
    })
    return deferred.promise;
}

function _getProjectIds() {
    var deferred = q.defer();
    var args = {
        headers: {
            "Authorization": "Bearer " + token,
            "Accept": "application/xml",
            "Accept-Encoding": "gzip, deflate",
        }
    }

    client.methods.getProjects(args, function (data, response) {
        if (response.statusCode == 200) {
            var projectIds = [];
            if (data.projectRefs) {
                _.each(data.projectRefs.project, function (project) {
                    projectIds.push(project.id);
                })
            }
            deferred.resolve(projectIds);
        } else {
            deferred.reject(response.statusMessage);
        }
    });
    return deferred.promise;
}

function _getProject(projectId) {
    var deferred = q.defer();
    var args = {
        headers: {
            "Authorization": "Bearer " + token,
            "Accept": "application/xml",
            "Accept-Encoding": "gzip, deflate",
        },
        path: {
            projectId: projectId
        }
    }

    client.methods.getProject(args, function (data, response) {
        if (response.statusCode == 200) {
            deferred.resolve(data.project);
        } else {
            deferred.reject(response.statusMessage);
        }
    });
    return deferred.promise;
}