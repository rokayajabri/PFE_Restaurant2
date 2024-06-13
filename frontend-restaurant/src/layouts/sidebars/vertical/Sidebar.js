import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import {
  Nav,
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Button,
} from 'reactstrap';
import { LogOut } from 'react-feather';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SimpleBar from 'simplebar-react';
import SidebarData from '../sidebardata/SidebarData';
import Logo from '../../logo/Logo';
import NavItemContainer from './NavItemContainer';
import NavSubMenu from './NavSubMenu';

import user1 from '../../../assets/images/users/user4.jpg';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentURL = location.pathname.split('/').slice(0, -1).join('/');
  const [loading, setLoading] = useState(false);

  const userData = JSON.parse(localStorage.getItem('user'));
  const { name } = userData;

  //const [collapsed, setCollapsed] = useState(null);
  // const toggle = (index) => {
  //   setCollapsed(collapsed === index ? null : index);
  // };

  const activeBg = useSelector((state) => state.customizer.sidebarBg);
  const isFixed = useSelector((state) => state.customizer.isSidebarFixed);


  const handleLogout = async () => {
    try {
        const userData = JSON.parse(localStorage.getItem("user")); // Récupérer les données de l'utilisateur depuis le stockage local
        const headers = {
            Authorization: `Bearer ${userData.access_token}`,
            'Content-Type': 'application/json',
        };

        // Set loading state
        setLoading(true);

        await axios.post("http://127.0.0.1:8001/api/logout", null, { headers });
        localStorage.removeItem('user'); // Assurez-vous que le nom du token est correctement orthographié
        navigate('/');
        console.log("Logout successful");
        setLoading(false);
        // Actualiser la page après la déconnexion
        window.location.reload();
       
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
};


  return (
    <div className={`sidebarBox shadow bg-${activeBg} ${isFixed ? 'fixedSidebar' : ''}`}>
      <SimpleBar style={{ height: '100%' }}>
        {/********Logo*******/}
        <div className="d-flex p-3 align-items-center">
          <Logo />
          
        </div>
        {/********Sidebar Content*******/}
        <div className="py-4 text-center profile-area">
          <img src={user1} alt="John Deo" width={60} className="rounded-circle mb-2" />
          <UncontrolledDropdown>
            <DropdownToggle caret className="bg-transparent border-0">
            {name}
            </DropdownToggle>
            <DropdownMenu className='w-100 border'>
              <DropdownItem className="px-4 py-3">
                <LogOut size={15} className="text-muted"/>
                <Button size="sm" onClick={handleLogout} 
                style={{ backgroundColor: 'transparent', border: 'none', padding: 0, color: 'inherit',fontSize:15,paddingLeft:2 }}>
                  Logout</Button>
                &nbsp; 
              </DropdownItem>
              
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
        <div>
          <Nav vertical className={activeBg === 'white' ? '' : 'lightText'}>
            {SidebarData.map((navi) => {
              if (navi.caption) {
                return (
                  <div className="navCaption fw-bold text-uppercase mt-4" key={navi.caption}>
                    {navi.caption}
                  </div>
                );
              }
              if (navi.children) {
                return (
                  <NavSubMenu
                    key={navi.id}
                    icon={navi.icon}
                    title={navi.title}
                    items={navi.children}
                    suffix={navi.suffix}
                    suffixColor={navi.suffixColor}
                    // toggle={() => toggle(navi.id)}
                    // collapsed={collapsed === navi.id}
                    isUrl={currentURL === navi.href}
                  />
                );
              }
              return (
                <NavItemContainer
                  key={navi.id}
                  //toggle={() => toggle(navi.id)}
                  className={location.pathname === navi.href ? 'activeLink' : ''}
                  to={navi.href}
                  title={navi.title}
                  suffix={navi.suffix}
                  suffixColor={navi.suffixColor}
                  icon={navi.icon}
                />
              );
            })}
          </Nav>
        </div>
      </SimpleBar>
    </div>
  );
};

export default Sidebar;
