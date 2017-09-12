module.exports = function (url, token) {
    if (!url) throw new Error('Invalid YouTrack url format');
    if (!token) throw new Error('Invalid permanent Token, see https://www.jetbrains.com/help/youtrack/standalone/Log-in-to-YouTrack.html#dev-Permanent-Token for details');
    var self = this;

    self.project = require('./project');
    self.project.init(url, token);
    self.issue = require('./issue');
    self.issue.init(url, token);
    self.timeTracking = require('./time-tracking');
    self.timeTracking.init(url, token);

    /*
    self.timeTracking = require('./time-tracking');
    self.user = require('./user');
    self.project = require('./project');
    self.admin = require('./admin');

    self.getSearchIntelliSense = function(query, context, caret, optionsLimit){};
    self.getCommandIntelliSense = function(issueId, command, runAs, caret, optionsLimit){};
    self.getGlobalTimeTrackingSettings = function(){};
    self.getProjecttimeTrackingSettings = function(projectId){};
    self.setGlobalTimeTrackingSettings = function(daysAWeek, hoursADay){};
    self.setProjectTimeTrackingSettings = function(projectId, estimateField, timeSpentfield, enabled){};
    */
}