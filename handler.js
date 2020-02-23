'use strict';

const serverless = require('serverless-http');
const express = require('express');
const app = express()
const mysql = require('mysql');
const uuid = require('uuid/v4');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA   
});

app.get('/tasks', function (req, res) {
  connection.query('SELECT * from `task`', function (error, results) {
    if (error) {
      console.error("Your query hit a problem", error);
      res.status(500).json({ errorMessage: error });
    }
    else {
      res.json({ todolist: results });
    }
  });
});

app.post('/tasks/', function (req, res) {
  connection.query('INSERT INTO task (taskId, description, category, completed, categoryId, priority) VALUES ("8b57737d-2200-4b40-ae6c-ea70276276f0", "Your task add works", "Home", 0, 1, 0)', function (error, results) {
    if (error) {
      console.error("Failed to add a task", error);
      res.json({ errorMessage: error });
    }
    else {
      res.json({ message: "Task successfully added" })
    }
  });
});

app.put('/tasks/:taskId', function (req, res) {
  var taskId = req.params.taskId;
  var sql = "UPDATE task SET completed = 1 WHERE taskId = ?";
  connection.query(sql, taskId, function (error, results) {
    if (error) {
      console.error("Unable to update task", error);
      res.json({ errorMessage: error})
    }
    else {
      res.json({ message: "Task successfully updated"});
    }
  });
});

app.delete('/tasks/:taskId', function (req, res) {
  var taskId = req.params.taskId;
  var sql = "DELETE FROM task WHERE taskId = ?"
  connection.query(sql, taskId, function (error, results) {
    if (error) {
      console.error("Unable to delete task", error);
      res.json({ errorMessage: error })
    }
    else {
      res.json({ message: "Task successfully deleted" });
    }
  });
});

module.exports.tasks = serverless(app);
