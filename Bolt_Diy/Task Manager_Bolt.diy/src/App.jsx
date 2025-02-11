import React, { useState } from 'react';
  import './App.css';

  function App() {
    const [tasks, setTasks] = useState(
      JSON.parse(localStorage.getItem('tasks')) || []
    );
    const [newTask, setNewTask] = useState('');
    const [newCategory, setNewCategory] = useState('select category');
    const [newPriority, setNewPriority] = useState('select priority');
    const [newDeadline, setNewDeadline] = useState(''); // New deadline state

    const categories = ['Personal', 'Work', 'Miscellaneous'];
    const priorities = ['High', 'Normal', 'Low'];

    const addTask = () => {
      if (newTask.trim() !== '') {
        const newTaskItem = {
          id: Date.now(),
          text: newTask,
          category: newCategory,
          priority: newPriority,
          completed: false,
          deadline: newDeadline, // Add deadline to new task
        };
        setTasks([...tasks, newTaskItem].sort((a, b) => {
          const priorityOrder = { High: 0, Normal: 1, Low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }));
        localStorage.setItem(
          'tasks',
          JSON.stringify([...tasks, newTaskItem].sort((a, b) => {
            const priorityOrder = { High: 0, Normal: 1, Low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          }))
        );
        setNewTask('');
        setNewCategory('select category');
        setNewPriority('select priority');
        setNewDeadline(''); // Reset deadline
      }
    };

    const toggleComplete = (id) => {
      const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    const deleteTask = (id) => {
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    return (
      <div className="App">
        <h1>Simple Task Manager</h1>
        <div className="input-area">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add task..."
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
          >
            <option value="">Select Priority</option>
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
            placeholder="Set Deadline"
          /> {/* Input for deadline */}
          <button onClick={addTask}>Add Task</button>
        </div>
        <h2>Upcoming Tasks</h2>
        <ul>
          {tasks
            .filter((task) => !task.completed)
            .sort((a, b) => {
              const priorityOrder = { High: 0, Normal: 1, Low: 2 };
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            })
            .map((task) => (
              <li key={task.id}>
                <span
                  style={{
                    textDecoration: task.completed ? 'line-through' : '',
                  }}
                >
                  {task.text} ({task.category}, {task.priority}, {task.deadline})
                </span>
                <div>
                  <button onClick={() => toggleComplete(task.id)}>
                    {task.completed ? 'Undo' : 'Complete'}
                  </button>
                  <button onClick={() => deleteTask(task.id)}>Delete</button>
                </div>
              </li>
            ))}
        </ul>
        <h2>Completed Tasks</h2>
        <ul>
          {tasks
            .filter((task) => task.completed)
            .map((task) => (
              <li key={task.id}>
                <span style={{ textDecoration: 'line-through' }}>
                  {task.text} ({task.category}, {task.priority}, {task.deadline})
                </span>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </li>
            ))}
        </ul>
      </div>
    );
  }

  export default App;
