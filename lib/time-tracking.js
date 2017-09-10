var q = require('q');
var o2x = require('object-to-xml');
var Client = require('node-rest-client').Client;

var client = new Client();
var token;

module.exports.init = function (_url, _token) {
    url = _url;
    token = _token;
    client.registerMethod('createWorkItem', _url + "/rest/issue/${issueId}/timetracking/workitem", "POST");
};

module.exports.createWorkItem = function (issueId, date, duration, description) {
    var deferred = q.defer();
    var workItem = {
        date: now.getTime(),
        duration: duration,
        description: description
    }
    var data = o2x({ workItem });
    var args = {
        headers: {
            "Authorization": "Bearer " + token,
            "Accept": "application/json",
            "Accept-Encoding": "gzip, deflate",
            "Content-Type": "application/xml"
        },
        data: data,
        path: {
            issueId: issueId
        }
    }

    client.methods.addTimeTracking(args, function (data, response) {
        var location = response.headers.location;
        if (response.statusCode == 201 && location) {
            var timetrackingId = location.substring(location.lastIndexOf('/') + 1);
            deferred.resolve(timetrackingId);
        } else {
            deferred.reject(response.statusMessage);
        }
    });
    return deferred.promise;
};