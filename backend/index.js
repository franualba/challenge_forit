const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let tasks = [
    {
        id: '1',
        title: "Tarea 1",
        description: "Primera tarea de la lista",
        completed: false,
        createdAt: new Date()
    }
];

app.get("/api/tasks", (req, res) => {
    res.json(tasks);
})

function nextID(tasks) {
    const maxID = (tasks.length > 0) ? Math.max(...tasks.map(task => task.id)) : 0;
    return String(maxID + 1)
}

app.post("/api/tasks", (req, res) => {
    if (!req.body.title) {
        return res.status(400).json({error: "Missing task title"})
    }
    const task = {
        id: nextID(tasks),
        title: req.body.title,
        description: req.body.description,
        completed: false,
        createdAt: new Date()
    }
    tasks = tasks.concat(task);
    res.json(tasks);
})

app.put("/api/tasks/:id", (req, res) => {
    const taskID = req.params.id;
    const taskExists = tasks.some(task => task.id === taskID);
    
    if (!taskExists) {
        return res.status(404).json({error: "Required task doesn't exist"})
    }

    const updatedTask = {
        id: req.params.id,
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed,
        createdAt: req.body.createdAt
    }

    tasks = tasks.map(task => (task.id === taskID) ? updatedTask : task);
    res.sendStatus(200);
})

app.delete("/api/tasks/:id", (req, res) => {
    const taskID = req.params.id;
    const taskExists = tasks.some(task => task.id === taskID);
    
    if (!taskExists) {
        return res.status(404).json({error: "Required task doesn't exist"})
    }

    tasks = tasks.filter(task => task.id !== taskID);
    res.sendStatus(200);
})

const port = process.env.PORT || 3000;

app.listen(port, (err) => {
    console.log(`Server listening on port ${port}`);
})

