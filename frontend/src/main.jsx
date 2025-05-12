import { createRoot } from 'react-dom/client'
import { useState, useEffect } from 'react'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate
} from 'react-router-dom'


const TaskItem = ({task}) => {

  return (
    <li>{task.title} - {task.description}</li>
  )
} 

const TaskList = ({tasks}) => {
  
  return (
    <ul>
      {tasks.map(task => <TaskItem key={task.id} task={task}/>)}
    </ul>
  )  
} 

const TaskForm = ({setter}) => {

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const navigate = useNavigate();

  const addTask = e => {
    e.preventDefault();
    const newTask = {
      title: title,
      description: desc
    }
    fetch("http://localhost:3000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newTask)
    })
    .then(res => res.json())
    .then(data => {
      console.log("Added new task");
      setter(data);
      navigate("/tasks");
    })
  }

  const handleTitleChange = e => {
    setTitle(e.target.value);
  }

  const handleDescChange = e => {
    setDesc(e.target.value);
  }

  return (
    <form onSubmit={addTask}>
      <input name="title" value={title} onChange={handleTitleChange}></input>
      <input name="description" value={desc} onChange={handleDescChange}></input>
      <button type="submit">Agregar</button>
    </form>
  )
} 


function App() {
  
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/tasks")
    .then(res => res.json())
    .then(data => {
      setTasks(data);
    })
  }, [])

  const style = {
    padding: 5
  }

  return (
    <>
      <div>
        <Link style={style} to="/tasks">All tasks</Link>
        <Link style={style} to="/tasks/new">New task</Link>
      </div>
      <Routes>
        <Route path="/tasks" element={<TaskList tasks={tasks}/>}/>
        <Route path="/tasks/new" element={<TaskForm setter={setTasks}/>}/>
      </Routes>
    </>
  )
}

createRoot(document.getElementById('root')).render(<Router><App/></Router>);
