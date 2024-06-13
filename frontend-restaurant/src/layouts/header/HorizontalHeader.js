import React from 'react';
import {
  Navbar,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  Button,
  Container,
} from 'reactstrap';
import { Menu } from 'react-feather';
import { useSelector, useDispatch } from 'react-redux';


import user1 from '../../assets/images/users/user4.jpg';

import { ToggleMobileSidebar } from '../../store/customizer/CustomizerSlice';
import ProfileDD from './ProfileDD';

import HorizontalLogo from '../logo/HorizontalLogo';
import Logout from './Logout';

const HorizontalHeader = () => {
  const isDarkMode = useSelector((state) => state.customizer.isDark);
  const topbarColor = useSelector((state) => state.customizer.topbarBg);
  // const isMobileSidebar = useSelector((state) => state.customizer.isMobileSidebar);
  const dispatch = useDispatch();


  return (
    <Navbar
      color={topbarColor}
      dark={!isDarkMode}
      light={isDarkMode}
      expand="lg"
      className="shadow HorizontalTopbar p-0"
    >
      <Container fluid className="d-flex align-items-center boxContainer">
        {/******************************/}
        {/**********Logo**********/}
        {/******************************/}
        <div className="pe-4 py-3 ">
          <HorizontalLogo />
        </div>
        {/******************************/}
        {/**********Toggle Buttons**********/}
        {/******************************/}

        <Nav className="me-auto" navbar>
          <Button
            color={topbarColor}
            className="d-sm-block d-lg-none"
            onClick={() => dispatch(ToggleMobileSidebar())}
          >
            <Menu size={22} />
          </Button>
          
        </Nav>
      
        {/******************************/}
        {/**********Profile DD**********/}
        {/******************************/}
        <UncontrolledDropdown>
          <DropdownToggle tag="span" className="p-2 cursor-pointer ">
         <img src={user1} alt="profile" className="rounded-circle" width="30" />
          </DropdownToggle>
          <DropdownMenu className="ddWidth" end>
            <ProfileDD />
            <Logout/>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Container>
    </Navbar>
  );
};

export default HorizontalHeader;
