import React, { useState, useEffect } from 'react';
import api from './services/api';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });
  const [editingTask, setEditingTask] = useState(null);

  // Charger les tâches au démarrage
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks');
      setTasks(response.data.data);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement des tâches');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingTask) {
        // Mettre à jour
        await api.put(`/tasks/${editingTask._id}`, formData);
        alert('Tâche mise à jour !');
      } else {
        // Créer
        await api.post('/tasks', formData);
        alert('Tâche créée !');
      }
      
      // Réinitialiser le formulaire
      setFormData({ title: '', description: '', priority: 'medium' });
      setEditingTask(null);
      loadTasks(); // Recharger la liste
    } catch (error) {
      alert('Erreur: ' + (error.response?.data?.message || 'Une erreur est survenue'));
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette tâche ?')) return;
    
    try {
      await api.delete(`/tasks/${id}`);
      alert('Tâche supprimée !');
      loadTasks();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const toggleComplete = async (task) => {
    try {
      await api.put(`/tasks/${task._id}`, {
        ...task,
        completed: !task.completed
      });
      loadTasks();
    } catch (error) {
      alert('Erreur lors de la mise à jour');
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#28a745',
      medium: '#ffc107',
      high: '#dc3545'
    };
    return colors[priority] || '#6c757d';
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="App">
      <div className="container">
        <h1>📝 Gestionnaire de Tâches</h1>
        
        {/* Formulaire */}
        <div className="form-card">
          <h2>{editingTask ? 'Modifier la tâche' : 'Nouvelle tâche'}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Titre *"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="3"
            />
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
            >
              <option value="low">Basse priorité</option>
              <option value="medium">Priorité moyenne</option>
              <option value="high">Haute priorité</option>
            </select>
            
            <div className="form-buttons">
              <button type="submit">
                {editingTask ? 'Mettre à jour' : 'Créer la tâche'}
              </button>
              {editingTask && (
                <button 
                  type="button"
                  onClick={() => {
                    setEditingTask(null);
                    setFormData({ title: '', description: '', priority: 'medium' });
                  }}
                  className="cancel"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Liste des tâches */}
        <div className="tasks-list">
          <h2>Mes tâches ({tasks.length})</h2>
          
          {tasks.length === 0 ? (
            <p className="empty">Aucune tâche. Créez votre première tâche !</p>
          ) : (
            tasks.map(task => (
              <div key={task._id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                <div className="task-header">
                  <div className="task-title">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task)}
                    />
                    <h3>{task.title}</h3>
                    <span 
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(task.priority) }}
                    >
                      {task.priority === 'low' ? 'Basse' : task.priority === 'medium' ? 'Moyenne' : 'Haute'}
                    </span>
                  </div>
                  <div className="task-actions">
                    <button onClick={() => handleEdit(task)} className="edit">✏️</button>
                    <button onClick={() => handleDelete(task._id)} className="delete">🗑️</button>
                  </div>
                </div>
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
                <div className="task-date">
                  Créée le {new Date(task.createdAt).toLocaleDateString('fr-FR')}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;