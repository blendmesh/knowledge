import React from 'react';
import { Link } from 'react-router-dom';
import '@/styles/header.css';
import logo from '@/assets/blendmesh.svg'

const Header: React.FC = () => (
  <header className="header">
    <div className="header-container">
      <Link to="/" className="logo">
        <span style={{ display: "inline-flex", alignItems: "flex-end", gap: 8 }}>
            <img src={logo} alt="blendmeshing" style={{ width: 32, height: 32 }} />
            <span style={{ lineHeight: '32px', display: 'block' }}>BlendMesh</span>
          </span>
      </Link>
      <nav>
        <Link to="/blog" className="nav-link">Artigos</Link>
        <Link to="/trilhas" className="nav-link">Trilhas</Link>
        <Link to="/courses" className="nav-link">Cursos</Link>
        <Link to="/tutorials" className="nav-link">Tutoriais</Link>
        <Link to="/videos" className="nav-link">Vídeos</Link>
        {/* <Link to="/playground" className="nav-link">Playground</Link> */}
      </nav>
    </div>
  </header>
);

export default Header;