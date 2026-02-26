import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [students, setStudents] = useState([
    { id: '101', name: 'Alice Smith', subject: 'Mathematics', score: 95, grade: 'A' },
    { id: '102', name: 'Bob Johnson', subject: 'Physics', score: 82, grade: 'B' },
  ]);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    subject: '',
    score: ''
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const calculateGrade = (score) => {
    const s = parseInt(score);
    if (s >= 90) return 'A';
    if (s >= 80) return 'B';
    if (s >= 70) return 'C';
    if (s >= 60) return 'D';
    return 'F';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.id || !formData.name || !formData.subject || !formData.score) return;
    
    const newEntry = {
      ...formData,
      score: parseInt(formData.score),
      grade: calculateGrade(formData.score)
    };

    setStudents([...students, newEntry]);
    setFormData({ id: '', name: '', subject: '', score: '' });
  };

  const averageScore = students.length 
    ? (students.reduce((acc, curr) => acc + curr.score, 0) / students.length).toFixed(1)
    : 0;

  return (
    <div className="app-container content-layout">
      <div className={`dashboard-header ${isVisible ? 'fade-in' : ''}`}>
        <div className="badge">📚 Education Portal</div>
        <h1 className="title">
          Student <span className="gradient-text">Mark Entry</span>
        </h1>
        <p className="subtitle">
          Manage, calculate, and track student performances seamlessly.
        </p>
      </div>

      <div className={`dashboard-grid ${isVisible ? 'fade-in' : ''}`}>
        {/* Entry Form */}
        <div className="glass-panel form-panel">
          <h2>Add New Mark</h2>
          <form onSubmit={handleSubmit} className="mark-form">
            <div className="input-group">
              <label htmlFor="id">Student ID</label>
              <input 
                type="text" 
                id="id" 
                name="id" 
                placeholder="e.g. 104"
                value={formData.id}
                onChange={handleInputChange}
                required 
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="name">Student Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={handleInputChange}
                required 
              />
            </div>

            <div className="input-group">
              <label htmlFor="subject">Subject</label>
              <input 
                type="text" 
                id="subject" 
                name="subject" 
                placeholder="e.g. Computer Science"
                value={formData.subject}
                onChange={handleInputChange}
                required 
              />
            </div>

            <div className="input-group">
              <label htmlFor="score">Score (0-100)</label>
              <input 
                type="number" 
                id="score" 
                name="score" 
                min="0"
                max="100"
                placeholder="e.g. 88"
                value={formData.score}
                onChange={handleInputChange}
                required 
              />
            </div>

            <button type="submit" className="btn primary-btn submit-btn">
              Record Marks
              <span className="arrow">→</span>
            </button>
          </form>
        </div>

        {/* Analytics and Data Table */}
        <div className="data-panel">
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-value">{students.length}</div>
              <div className="stat-label">Total Entries</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{averageScore}</div>
              <div className="stat-label">Average Score</div>
            </div>
          </div>

          <div className="glass-panel table-panel">
            <h2>Recent Entries</h2>
            <div className="table-responsive">
              <table className="marks-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Subject</th>
                    <th>Score</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-state">No entries found.</td>
                    </tr>
                  ) : (
                    students.map((student, idx) => (
                      <tr key={idx} className="table-row-anim">
                        <td><span className="code-text">{student.id}</span></td>
                        <td className="font-medium">{student.name}</td>
                        <td>{student.subject}</td>
                        <td>
                          <div className="score-badge">{student.score}</div>
                        </td>
                        <td>
                          <span className={`grade-chip grade-${student.grade}`}>
                            {student.grade}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <div className="background-decorations">
        <div className="glow-orb purple"></div>
        <div className="glow-orb blue"></div>
      </div>
    </div>
  );
}

export default App;
