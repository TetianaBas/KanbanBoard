import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Ensure the path is correct
import Header from './components/Header/Header';
import Board from './components/Board/Board';
import Footer from './components/Footer/Footer';
import LoginForm from './components/LoginForm/LoginForm';
import SignupForm from './components/SignupForm/SignupForm';
import Home from './components/Home/Home';
import AddTaskForm from './components/TaskForm/TaskForm';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Home />} /> 
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/signup" element={<SignupForm />} />
                        {/* Protected route for logged-in users */}
                        <Route path="/board" element={<Board />} />
                        <Route path="/add-task" element={<AddTaskForm />} />
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
