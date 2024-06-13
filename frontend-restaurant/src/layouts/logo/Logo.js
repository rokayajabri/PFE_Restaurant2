import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import React from 'react';
import  LogoDarkIcon  from '../../assets/images/logos/1.png';
import LogoDarkText from '../../assets/images/logos/logoD.png';
import LogoWhiteText  from '../../assets/images/logos/logoW.png';
import LogoWhiteIcon  from '../../assets/images/logos/2.png';

const Logo = () => {
  const isDarkMode = useSelector((state) => state.customizer.isDark);
  const toggleMiniSidebar = useSelector((state) => state.customizer.isMiniSidebar);
  const activeSidebarBg = useSelector((state) => state.customizer.sidebarBg);
  return (
    <Link to="#" className="d-flex align-items-center gap-2">
      {isDarkMode || activeSidebarBg !== 'white' ? (
        <>
          <img src={LogoWhiteIcon} alt="Logo White Icon"  width={60}/>
          {toggleMiniSidebar ? '' : <img src={LogoWhiteText} className="d-none d-lg-block" alt='logo-text' width={120}/>}
          
        </>
      ) : (
        <>
          <img src={LogoDarkIcon} alt="Logo White Icon"  width={60}/>
          {!toggleMiniSidebar && <img src={LogoDarkText} className="d-none d-lg-block" alt="Logo White Text" width={120}/>}

        </>
      )}
    </Link>
  );
};

export default Logo;
