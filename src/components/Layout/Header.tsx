import React from 'react';
import { Link } from 'react-router-dom';
import '@/styles/header.css';
import logo from '@/assets/blendmesh.svg'

const Header: React.FC = () => (
  <header className="header">
    <div className="header-container">
      <Link to="/" className="logo">
        <span style={{ display: "inline-flex", alignItems: "flex-end", gap: 8 }}>
            <img src={logo} alt="blendmesh" style={{ width: 32, height: 32 }} />
            <span style={{ lineHeight: '32px', display: 'block' }}>BlendMesh</span>
          </span>
      </Link>
      <nav>
        <Link to="/courses">Cursos</Link>
        <Link to="/tutorials">Tutoriais</Link>
        <Link to="/blog">Artigos</Link>
        <Link to="/videos">Vídeos</Link>
        <Link to="/playground">Playground</Link>
      </nav>
    </div>
  </header>
);

export default Header;