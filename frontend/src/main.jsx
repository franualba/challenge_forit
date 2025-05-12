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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_PATH = import.meta.env.VITE_API_PATH || '/api/tasks';

// Estilos
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    background: '#f4f4f4',
    padding: '10px 20px',
    borderRadius: '5px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nav: {
    display: 'flex',
    gap: '15px',
  },
  navLink: {
    textDecoration: 'none',
    color: '#0066cc',
    padding: '5px 10px',
    borderRadius: '3px',
    transition: 'background-color 0.3s',
  },
  navLinkHover: {
    backgroundColor: '#e9e9e9',
  },
  taskList: {
    listStyle: 'none',
    padding: 0,
  },
  taskItem: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '10px',
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: '18px',
    margin: '0 0 5px 0',
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  taskMeta: {
    fontSize: '12px',
    color: '#999',
    marginTop: '5px',
  },
  completed: {
    textDecoration: 'line-through',
    color: '#999',
  },
  buttonGroup: {
    display: 'flex',
    gap: '5px',
  },
  button: {
    backgroundColor: '#0066cc',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    padding: '5px 10px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  deleteButton: {
    backgroundColor: '#cc0000',
  },
  editButton: {
    backgroundColor: '#ff9900',
  },
  checkButton: {
    backgroundColor: '#00cc66',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    maxWidth: '500px',
    margin: '0 auto',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  label: {
    fontWeight: 'bold',
  },
  input: {
    padding: '8px',
    borderRadius: '3px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  checkbox: {
    marginRight: '10px',
  },
  submitButton: {
    backgroundColor: '#0066cc',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    padding: '10px',
    fontSize: '16px',
    cursor: 'pointer',
  }
}

const TaskItem = ({ task, onDelete, onToggleComplete }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);    
    return new Intl.DateTimeFormat("es-AR", {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    }).format(date)
  };
  
  return (
    <li style={styles.taskItem}>
      <div style={styles.taskInfo}>
        <h3 style={{...styles.taskTitle, ...(task.completed ? styles.completed : {})}}>{task.title}</h3>
        <p style={{...styles.taskDescription, ...(task.completed ? styles.completed : {})}}>{task.description}</p>
        <p style={styles.taskMeta}>Creada: {formatDate(task.createdAt)}</p>
      </div>
      <div style={styles.buttonGroup}>
        <button 
          style={{...styles.button, ...styles.checkButton}} 
          onClick={() => onToggleComplete(task)}
        >
          {task.completed ? 'Deshacer' : 'Completada'}
        </button>
        <button 
          style={{...styles.button, ...styles.editButton}} 
          onClick={() => navigate(`/tasks/edit/${task.id}`)}
        >
          Editar
        </button>
        <button 
          style={{...styles.button, ...styles.deleteButton}} 
          onClick={() => onDelete(task.id)}
        >
          Eliminar
        </button>
      </div>
    </li>
  )
}

const TaskList = ({ tasks, setTasks }) => {
  const deleteTask = (id) => {
    if (window.confirm('Eliminar tarea?')) {
      fetch(`${API_URL}${API_PATH}/${id}`, {
        method: 'DELETE',
      })
      .then(res => {
        if (res.ok) {
          setTasks(tasks.filter(task => task.id !== id));
        } else {
          alert('Error al eliminar tarea');
        }
      })
      .catch(error => console.error('Error deleting task:', error));
    }
  };
  
  const toggleComplete = (task) => {
    const updatedTask = { ...task, completed: !task.completed };
    
    fetch(`${API_URL}${API_PATH}/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    })
    .then(res => {
      if (res.ok) {
        setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
      } else {
        alert('Failed to update task');
      }
    })
    .catch(error => console.error('Error updating task:', error));
  };
  
  return (
    <div>
      {tasks.length === 0 ? 
      (<p>No hay tareas cargadas. Puedes agregar una haciendo clieck en "Nueva" arriba a la derecha.</p>) : 
      (<ul style={styles.taskList}>
          {tasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onDelete={deleteTask} 
              onToggleComplete={toggleComplete}
            />
          ))}
        </ul>
      )}
    </div>
  )  
}

const TaskForm = ({ setTasks, existingTask = null }) => {
  const [title, setTitle] = useState(existingTask ? existingTask.title : "");
  const [desc, setDesc] = useState(existingTask ? existingTask.description : "");
  const [completed, setCompleted] = useState(existingTask ? existingTask.completed : false);
  const navigate = useNavigate();
  const isEditing = !!existingTask;
  
  const handleSubmit = e => {
    e.preventDefault();
    
    const taskData = {
      title: title,
      description: desc
    };
    
    if (isEditing) {
      taskData.completed = completed;
      taskData.createdAt = existingTask.createdAt;
      
      fetch(`${API_URL}${API_PATH}/${existingTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(taskData)
      })
      .then(res => {
        if (res.ok) {
          return fetch(`${API_URL}${API_PATH}`);
        } else {
          throw new Error('Failed to update task');
        }
      })
      .then(res => res.json())
      .then(data => {
        console.log("Updated task");
        setTasks(data);
        navigate("/tasks");
      })
      .catch(error => {
        console.error('Error:', error);
        alert(error.message);
      });
    } else {
      fetch(`${API_URL}${API_PATH}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(taskData)
      })
      .then(res => res.json())
      .then(data => {
        console.log("Added new task");
        setTasks(data);
        navigate("/tasks");
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to add task');
      });
    }
  }
  
  return (
    <div>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="title">Título:</label>
          <input 
            style={styles.input} 
            id="title"
            name="title" 
            value={title} 
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="description">Descripción:</label>
          <input 
            style={styles.input} 
            id="description"
            name="description" 
            value={desc} 
            onChange={e => setDesc(e.target.value)}
          />
        </div>
        
        {isEditing && (
          <div style={styles.formGroup}>
            <label style={{display: 'flex', alignItems: 'center'}}>
              <input 
                type="checkbox" 
                style={styles.checkbox}
                checked={completed} 
                onChange={e => setCompleted(e.target.checked)} 
              />
              Marcar completada
            </label>
          </div>
        )}
        
        <div>
          <button style={styles.submitButton} type="submit">
            {isEditing ? 'Modificar' : 'Agregar'} tarea
          </button>
        </div>
      </form>
    </div>
  )
}

const EditTask = ({ tasks, setTasks }) => {
  const { id } = useParams();
  const task = tasks.find(task => task.id === id);
  
  if (!task) {
    return <div>Tarea no encontrada</div>;
  }
  
  return <TaskForm setTasks={setTasks} existingTask={task} />;
}

function App() {
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    fetch(`${API_URL}${API_PATH}`)
    .then(res => res.json())
    .then(data => {
      setTasks(data);
    })
    .catch(error => {
      console.error('Error fetching tasks:', error);
    });
  }, []);
  
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Tareas</h1>
        <nav style={styles.nav}>
          <Link style={styles.navLink} to="/tasks">Todas</Link>
          <Link style={styles.navLink} to="/tasks/new">Nueva</Link>
        </nav>
      </header>
      
      <Routes>
        <Route path="/" element={<TaskList tasks={tasks} setTasks={setTasks} />} />
        <Route path="/tasks" element={<TaskList tasks={tasks} setTasks={setTasks} />} />
        <Route path="/tasks/new" element={<TaskForm setTasks={setTasks} />} />
        <Route path="/tasks/edit/:id" element={<EditTask tasks={tasks} setTasks={setTasks} />} />
      </Routes>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<Router><App /></Router>);