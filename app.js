const express = require("express");
const moment = require("moment");

const app = express();

app.get("/api", (req, res) => {
  const slackName = req.query.slack_name || "No Name";
  const track = req.query.track || "No Track";

  const currentDayOfWeek = moment().format("dddd");

  const currentUTCTime = moment().utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
  //   const currentUTCTime = moment().utc().format("YYYY-MM-DD HH:mm:ss");

  const githubFileURL =
    "https://github.com/Hack-Light/basic-node-hngx/blob/main/app.js";
  const githubRepoURL = "https://github.com/Hack-Light/basic-node-hngx";

  const responseJSON = {
    slack_name: slackName,
    current_day: currentDayOfWeek,
    utc_time: currentUTCTime,
    track: track,
    github_file_url: githubFileURL,
    github_repo_url: githubRepoURL,
    status_code: 200,
  };

  res.status(200).json(responseJSON);
});

// Start the Express server on port 3000
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is listening on port 3000");
});
