const express = require('express');
  const app = express();
  const port = 3001;
  let tasks = [];
  let nextId = 1;

  app.use(express.json());

  app.get('/api/tasks', (req, res) => {
    res.json(tasks);
  });

  app.post('/api/tasks', (req, res) => {
    const newTask = { id: nextId++, text: req.body.text, category: req.body.category, completed: false };
    tasks.push(newTask);
    res.status(201).json(newTask);
  });

  app.put('/api/tasks/:id/complete', (req, res) => {
    const task = tasks.find((task) => task.id === parseInt(req.params.id));
    if (task) {
      task.completed = !task.completed;
      res.json(task);
    } else {
      res.status(404).send('Task not found');
    }
  });

  app.delete('/api/tasks/:id', (req, res) => {
    tasks = tasks.filter((task) => task.id !== parseInt(req.params.id));
    res.status(204).send();
  });

  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
