import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './Pages/Signup/Signup';
import Login from './Pages/Login/Login';
import Dashboard from './Pages/Dashboard/Dashboard';
// Import the Dashboard component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard/>} /> {/* Add route for Dashboard */}
      </Routes>
    </Router>
  );
}

export default App;
