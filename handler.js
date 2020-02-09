'use strict';

const serverless = require('serverless-http');
const express = require('express');
const app = express()

app.get('/tasks', function (req, res) {
  res.json([
    {id: 0, description: "adopt dog", category: "Home", completed: false},
    {id: 1, description: "walk dog", category: "Home", completed: false}
  ]);
});

app.post('/tasks/task/create', function (req, res) {
  res.json({
    message: "The post endpoint works!"
  });
});

app.put('/tasks/task/:taskId', function (req, res) {
  res.json({
    message: req.params
  });
});

app.delete('/tasks/task/:taskId', function (req, res) {
  res.json({
    message: req.params
  });
});

module.exports.tasks = serverless(app);
