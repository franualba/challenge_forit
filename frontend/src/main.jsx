import { createRoot } from 'react-dom/client'
import { useState, useEffect } from 'react'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams
} from 'react-router-dom'


const TaskItem = ({task}) => {

  return (
    <li>{task.title}</li>
  )
} 

const TaskList = ({tasks}) => {
  
  return (
    <ul>
      {tasks.map(task => <TaskItem key={task.id} task={task}/>)}
    </ul>
  )  
} 

const TaskForm = () => {

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const addTask = e => {
    e.preventDefault();

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
        <Route path="/tasks/new" element={<TaskForm/>}/>
      </Routes>
    </>
  )
}

createRoot(document.getElementById('root')).render(<Router><App/></Router>);
