import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Courses from './pages/Courses';
import Tutorials from './pages/Tutorials';
import TutorialDetail from './pages/TutorialDetail';
import Videos from './pages/Videos';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import './styles/global.css';
import TutorialEditor from './components/Tutorial/TutorialEditor';
import CoursePage from './components/Course/CoursePage';
import CourseEditor from './components/Course/CourseEditor';
import Classroom from "@/components/Course/Classroom";
import BlogEditor from "@/components/Blog/BlogEditor";
import BlogPostPage from './components/Blog/BlogPostPage';
import VideosEditor from './components/Video/VideosEditor';
import TrilhaEditor from './components/Trilha/TrilhaEditor';
import Trilhas from './pages/Trilhas';
import TrilhaProgress from './components/Trilha/TrilhaProgress';
import Concluido from './components/Course/Concluido';
import RoteiroEditor from './components/Roteiro/Roteiro';

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
        <Route path="/blog-editor" element={<BlogEditor />} />
        <Route path="/blog/:id" element={<BlogPostPage />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses-editor" element={<CourseEditor />} />
        <Route path="/courses/:id" element={<CoursePage />} />
        <Route path="/classroom/:id/:tutorialId?" element={<Classroom />} />
        <Route path="/classroom/:id/concluido" element={<Concluido />} />
        <Route path="/tutorials" element={<Tutorials />} />
        <Route path="/tutorials/:id" element={<TutorialDetail />} />
        <Route path="/tutorials-editor" element={<TutorialEditor />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/videos-editor" element={<VideosEditor />} />
        <Route path="/trilhas" element={<Trilhas />} />
        <Route path="/trilhas-editor" element={<TrilhaEditor />} />
        <Route path="/trilhas-progress/:id/:itemIdx?" element={<TrilhaProgress />} />
        <Route path="/roteiros-editor" element={<RoteiroEditor />} />
      </Routes>
    </main>
    <Footer />
  </BrowserRouter>
);

export default App;
