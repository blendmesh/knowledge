import React from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';

const Sidebar: React.FC = () => {
    return (
        <div className="sidebar">
            <h2>Menu</h2>
            <ul>
                <li>
                    <Link to="/courses">Cursos</Link>
                </li>
                <li>
                    <Link to="/tutorials">Tutoriais</Link>
                </li>
                <li>
                    <Link to="/blog">Artigos</Link>
                </li>
                <li>
                    <Link to="/videos">Vídeos</Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;