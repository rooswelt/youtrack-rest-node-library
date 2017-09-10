youtrack-rest-node-library
==========================

Node library for accessing the Youtrack 4.0 REST API.  Partially designed/ported from the [python version](https://github.com/JetBrains/youtrack-rest-python-library/) from YouTrack

All of the API is exposed through promises and/or callbacks.


Full YouTrack RESTful API [here](http://confluence.jetbrains.com/display/YTD4/YouTrack+REST+API+Reference)

# Installation

```
npm install https://github.com/rooswelt/youtrack-rest-node-library
```

# Usage
Obtain a permanent login token following [this guide](https://www.jetbrains.com/help/youtrack/standalone/Log-in-to-YouTrack.html#dev-Permanent-Token)
```
var Connection = require('youtrack-rest-node-library');

const TOKEN = 'perm:cm9vdA==.Qk9UICBUb2tlbg==.whzUnClqO7hn0XTnP7wska5RRSSuwQ';
const BASE_URL = 'http://localhost:81';

var youtrack = new Connection(BASE_URL, TOKEN);

youtrack.issue.createIssue(...);
youtrack.issue.getIssue(...);
youtrack.timeTracking.createWorkItem(...);
```

# License
Apache 2.0
