var q = require('q');
var _ = require('lodash');
var Client = require('node-rest-client').Client;

var client = new Client();
client.parsers.find("XML").options = { "explicitArray": false, "ignoreAttrs": false, "mergeAttrs": true };
var token;

module.exports.init = function (_url, _token) {
  url = _url;
  token = _token;
  client.registerMethod('createIssue', _url + "/rest/issue?project=${project}&summary=${summary}&description=${description}", "PUT");
  client.registerMethod('getIssue', _url + "/rest/issue/${issueId}?wikifyDescription=${wikifyDescription}", "GET");
  client.registerMethod('getProjectIssues', _url + "/rest/issue/byproject/${projectId}?filter=${filter}&after=${after}&max=${max}&updatedAfter=${updatedAfter}&wikifyDescription=${wikifyDescription}", "GET");
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
      var issue = _parseResponseToIssue(data);
      deferred.resolve(issue);
    } else {
      deferred.reject(response.statusMessage);
    }
  });
  return deferred.promise;
}

module.exports.getProjectIssues = function (projectId, filter, after, max) {
  var deferred = q.defer();
  var args = {
    path: {
      projectId: projectId,
      filter: filter,
      after: after,
      max: max,
      updatedAfter: '',
      wikifyDescription: false
    }
  }
  client.methods.getProjectIssues(args, function (data, response) {
    if (response.statusCode == 200) {
      var issues = [];
      if (data.issues && data.issues) {
        _.each(data.issues.issue, function (issue) {
          issues.push(_parseResponseToIssue(issue));
        })
      }
      deferred.resolve(issues);
    } else {
      deferred.reject(response.statusMessage);
    }
  });
  return deferred.promise;
}

function _parseResponseToIssue(object) {
  var issue = {};
  issue.id = object.id;
  issue.summary = _.findWhere(object.field, { name: "summary" }).value;
  return issue;
}
