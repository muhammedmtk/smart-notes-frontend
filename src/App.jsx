import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import NotesList from './pages/Notes/NotesList';
import CreateNote from './pages/Notes/CreateNote';
import NoteDetails from './pages/Notes/NoteDetails';
import EditNote from './pages/Notes/EditNote';
import Profile from './pages/Profile/Profile';

function App() {
  return (
    <ThemeProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/notes" element={<NotesList />} />
            <Route path="/notes/create" element={<CreateNote />} />
            <Route path="/notes/:id" element={<NoteDetails />} />
            <Route path="/notes/:id/edit" element={<EditNote />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;