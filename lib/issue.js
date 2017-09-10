var q = require('q');
var Client = require('node-rest-client').Client;

var client = new Client();
var token;

module.exports.init = function (_url, _token) {
  url = _url;
  token = _token;
  client.registerMethod('createIssue', _url + "/rest/issue?project=${project}&summary=${summary}&description=${description}", "PUT");
  client.registerMethod('getIssue', _url + "/rest/issue/${issueId}?wikifyDescription=${wikifyDescription}", "GET");
  client.registerMethod('getProjectIssues', _url + "/rest/issue/byproject/${project}?${filter}&${after}&${max}&${updatedAfter}&${wikifyDescription}", "GET");
};

module.exports.createIssue = function (project, summary, description) {
  var deferred = q.defer();
  var args = {
    headers: {
      "Authorization": "Bearer " + token,
      "Accept": "application/json",
      "Accept-Encoding": "gzip, deflate"
    },

    path: {
      project: project,
      summary: summary,
      description: description
    }
  }
  client.methods.createIssue(args, function (data, response) {
    var location = response.headers.location;
    if (response.statusCode == 201 && location) {
      var issueId = location.substring(location.lastIndexOf('/') + 1);
      deferred.resolve(issueId);
    } else {
      deferred.reject(response.statusMessage);
    }
  });
  return deferred.promise;
}

module.exports.getIssue = function (issueId) {
  var deferred = q.defer();
  var args = {
    path: {
      issueId: issueId,
      wikifyDescription: false
    }
  }
  client.methods.getIssue(args, function (data, response) {
    if (response.statusCode == 200) {
      var issue = _parseXMLToIssue(data);
      deferred.resolve(issue);
    } else {
      deferred.reject(response.statusMessage);
    }
  });
  return deferred.promise;
}

function _parseXMLToIssue(data) {
  //TODO how to parse correctly?
  return data.issue;
}
