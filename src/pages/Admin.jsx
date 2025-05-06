import React, { useState } from 'react';
import UsuariosAdmin from '../components/admin/UsuariosAdmin';
import TorneosAdmin from '../components/admin/TorneosAdmin';


const Admin = () => {
  const [activeSection, setActiveSection] = useState('usuarios');

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3">
          <div className="list-group">
            <button
              className={`list-group-item list-group-item-action ${activeSection === 'usuarios' ? 'active' : ''}`}
              onClick={() => handleSectionChange('usuarios')}
            >
              Usuarios
            </button>
            <button
              className={`list-group-item list-group-item-action ${activeSection === 'torneos' ? 'active' : ''}`}
              onClick={() => handleSectionChange('torneos')}
            >
              Torneos
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="col-md-9">
          {activeSection === 'usuarios' && <UsuariosAdmin />}
          {activeSection === 'torneos' && <TorneosAdmin />}
        </div>
      </div>
    </div>
  );
};

export default Admin;
