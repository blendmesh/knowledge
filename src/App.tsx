import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Courses from './pages/Courses';
import Tutorials from './pages/Tutorials';
import Videos from './pages/Videos';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import './styles/global.css';

const App: React.FC = () => (
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    <Header />
    <main className="main-content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/tutorials" element={<Tutorials />} />
        <Route path="/videos" element={<Videos />} />
      </Routes>
    </main>
    <Footer />
  </BrowserRouter>
);

export default App;
