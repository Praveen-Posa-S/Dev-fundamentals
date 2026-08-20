import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://glowing-rotary-phone-x5pr99vjqg9xhvxpq-8000.app.github.dev';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/todos`);
      setTodos(response.data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to fetch tasks. Ensure backend is running.');
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/todos`, { title: title.trim() });
      if (response.data) {
        setTodos((prev) => [...prev, response.data]);
        setTitle('');
      }
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Could not save task to database.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/todos/${id}`, {
        is_completed: !currentStatus,
      });
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? response.data : t))
      );
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task status.');
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/todos/${id}`);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task.');
    }
  };

  const pendingTodos = todos.filter((t) => !t.is_completed);
  const completedTodos = todos.filter((t) => t.is_completed);

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <div style={styles.headerArea}>
          <h1 style={styles.title}>Workspace Tasks</h1>
          <p style={styles.subtitle}>Track your daily agenda and updates</p>
        </div>

        {/* Metrics Grid */}
        <div style={styles.metricsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{todos.length}</span>
            <span style={styles.statLabel}>Total</span>
          </div>
          <div style={{ ...styles.statCard, borderColor: '#fef3c7', backgroundColor: '#fffbeb' }}>
            <span style={{ ...styles.statNumber, color: '#d97706' }}>{pendingTodos.length}</span>
            <span style={{ ...styles.statLabel, color: '#b45309' }}>Pending</span>
          </div>
          <div style={{ ...styles.statCard, borderColor: '#d1fae5', backgroundColor: '#ecfdf5' }}>
            <span style={{ ...styles.statNumber, color: '#059669' }}>{completedTodos.length}</span>
            <span style={{ ...styles.statLabel, color: '#047857' }}>Completed</span>
          </div>
        </div>

        {error && <div style={styles.errorBanner}>{error}</div>}

        {/* Input Form */}
        <form onSubmit={handleAddTodo} style={styles.form}>
          <input
            type="text"
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.addButton}>
            {loading ? 'Adding...' : '+ Add'}
          </button>
        </form>

        {/* Pending Tasks */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTitle}>In Progress</span>
            <span style={styles.badge}>{pendingTodos.length}</span>
          </div>

          {pendingTodos.length === 0 ? (
            <div style={styles.emptyState}>No pending tasks right now.</div>
          ) : (
            <div style={styles.taskList}>
              {pendingTodos.map((todo) => (
                <div key={todo.id} style={styles.taskItem}>
                  <div
                    style={styles.taskLeft}
                    onClick={() => handleToggleStatus(todo.id, todo.is_completed)}
                  >
                    <div style={styles.customCheckboxUnchecked} />
                    <span style={styles.taskText}>{todo.title}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    style={styles.deleteBtn}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Tasks */}
        <div style={{ ...styles.section, marginTop: '28px' }}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTitle}>Completed</span>
            <span style={{ ...styles.badge, backgroundColor: '#ecfdf5', color: '#059669' }}>
              {completedTodos.length}
            </span>
          </div>

          {completedTodos.length === 0 ? (
            <div style={styles.emptyState}>No completed tasks yet.</div>
          ) : (
            <div style={styles.taskList}>
              {completedTodos.map((todo) => (
                <div key={todo.id} style={{ ...styles.taskItem, backgroundColor: '#f9fafb', opacity: 0.85 }}>
                  <div
                    style={styles.taskLeft}
                    onClick={() => handleToggleStatus(todo.id, todo.is_completed)}
                  >
                    <div style={styles.customCheckboxChecked}>✓</div>
                    <span style={{ ...styles.taskText, ...styles.taskTextDone }}>
                      {todo.title}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    style={styles.deleteBtn}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    backgroundColor: '#f1f5f9',
    padding: '40px 16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    boxSizing: 'border-box',
  },
  card: {
    width: '100%',
    maxWidth: '520px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
    border: '1px solid #e2e8f0',
  },
  headerArea: { marginBottom: '24px' },
  title: { margin: 0, fontSize: '24px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.5px' },
  subtitle: { margin: '6px 0 0', fontSize: '14px', color: '#64748b' },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 8px',
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
  },
  statNumber: { fontSize: '20px', fontWeight: '700', color: '#0f172a' },
  statLabel: { fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginTop: '2px', letterSpacing: '0.5px' },
  errorBanner: {
    padding: '10px 14px',
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '16px',
    border: '1px solid #fecaca',
  },
  form: { display: 'flex', gap: '8px', marginBottom: '28px' },
  input: {
    flex: 1,
    padding: '12px 16px',
    fontSize: '14px',
    color: '#0f172a',
    backgroundColor: '#ffffff',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    outline: 'none',
  },
  addButton: {
    padding: '12px 20px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
  },
  section: { display: 'flex', flexDirection: 'column' },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' },
  sectionTitle: { fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' },
  badge: {
    fontSize: '11px',
    fontWeight: '700',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '2px 8px',
    borderRadius: '12px',
  },
  taskList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  taskItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 14px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
  },
  taskLeft: { display: 'flex', alignItems: 'center', gap: '12px', flex: 1, cursor: 'pointer' },
  customCheckboxUnchecked: {
    width: '18px',
    height: '18px',
    borderRadius: '6px',
    border: '2px solid #cbd5e1',
    flexShrink: 0,
  },
  customCheckboxChecked: {
    width: '18px',
    height: '18px',
    borderRadius: '6px',
    backgroundColor: '#10b981',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  taskText: { fontSize: '14px', color: '#1e293b', wordBreak: 'break-word' },
  taskTextDone: { textDecoration: 'line-through', color: '#94a3b8' },
  deleteBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '4px 8px',
    borderRadius: '6px',
  },
  emptyState: {
    fontSize: '13px',
    color: '#94a3b8',
    padding: '14px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px dashed #e2e8f0',
    textAlign: 'center',
  },
};