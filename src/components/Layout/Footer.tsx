// import React from 'react';
// import '@/styles/footer.css';

// const Footer: React.FC = () => {
//     return (
//         <footer className="footer">
//             <div className="footer-content">
//                 <p>&copy; {new Date().getFullYear()} BlendMesh. Todos os direitos reservados.</p>
//                 <div className="footer-links">
//                     <a href="/privacy-policy">Política de Privacidade</a>
//                     <a href="/terms-of-service">Termos de Serviço</a>
//                     <a href="/contact">Contato</a>
//                 </div>
//             </div>
//         </footer>
//     );
// };

// export default Footer;

import React from 'react';
import '@/styles/footer.css';

const Footer: React.FC = () => (
  <footer className="footer">
    <div className="footer-container">
      <span>&copy; {new Date().getFullYear()} BlendMesh</span>
      <span>
        <a href="/privacy-policy">Privacidade</a> · <a href="/terms-of-service">Termos</a>
      </span>
    </div>
  </footer>
);

export default Footer;