'use strict';

const serverless = require('serverless-http');
const express = require('express');
const app = express()
const mysql = require('mysql');
const uuidv4 = require('uuid/v4');
app.use(express.json());

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
  const taskToAdd = req.body;
  taskToAdd.taskId = uuidv4();
  connection.query('INSERT INTO `task` SET ?', taskToAdd, function (error, results, fields) {
    if (error) {
      console.error("Failed to add a task", error);
      res.json({ errorMessage: error });
    }
    else {
      res.json({ 
        message: "Task successfully added",
        task: taskToAdd
      })
    }
  });
});

app.put('/tasks/:taskId', function (req, res) {
  var taskId = req.params.taskId;
  var sql = "UPDATE task SET completed = ?, priority = ? WHERE taskId = ?";
  connection.query(sql, [req.body.completed, req.body.priority, taskId], function (error, results) {
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
