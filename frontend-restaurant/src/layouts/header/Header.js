import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  Navbar,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  Button,
} from 'reactstrap';
import * as Icon from 'react-feather';

import user1 from '../../assets/images/users/user4.jpg';

import { ToggleMiniSidebar, ToggleMobileSidebar } from '../../store/customizer/CustomizerSlice';
import ProfileDD from './ProfileDD';
import Logo from '../logo/Logo';
import Logout from './Logout';


const Header = () => {
 
  const isDarkMode = useSelector((state) => state.customizer.isDark);
  const topbarColor = useSelector((state) => state.customizer.topbarBg);
  const dispatch = useDispatch();
  

  return (
    <Navbar
      color={topbarColor}
      dark={!isDarkMode}
      light={isDarkMode}
      expand="lg"
      className="topbar"
    >
      {/******************************/}
      {/**********Toggle Buttons**********/}
      {/******************************/}
      <div className="d-flex align-items-center">
        <Button
          color={topbarColor}
          className="d-none d-lg-block"
          onClick={() => dispatch(ToggleMiniSidebar())}
        >
          <Icon.Menu size={22} />
        </Button>
        <div href="/" className="d-sm-flex d-lg-none">
          <Logo />
        </div>
        <Button
          color={topbarColor}
          className="d-sm-block d-lg-none"
          onClick={() => dispatch(ToggleMobileSidebar())}
        >
          <Icon.Menu size={22} />
        </Button>
      </div>

      <div className="d-flex align-items-center">
        {/******************************/}
        {/**********Profile DD**********/}
        {/******************************/}
        <UncontrolledDropdown>
          <DropdownToggle color={topbarColor}>
            <img src={user1} alt="profile" className="rounded-circle" width="30" />
          </DropdownToggle>
          <DropdownMenu className="ddWidth">
            <ProfileDD />
            <Logout/>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    </Navbar>
  );
};

export default Header;
