import React from 'react';
import { useSelector } from 'react-redux';

import  LogoDarkIcon  from '../../assets/images/logos/1.png';
import LogoDarkText from '../../assets/images/logos/logoD.png';
import LogoWhiteText  from '../../assets/images/logos/logoW.png';
import LogoWhiteIcon  from '../../assets/images/logos/2.png';

const AuthLogo = () => {
  const isDarkMode = useSelector((state) => state.customizer.isDark);

  return (
    <div className="p-4 d-flex justify-content-center gap-2">
      {isDarkMode !== false ? (
        <>
           <img src={LogoWhiteIcon} alt="Logo White Icon" />
          <img src={LogoWhiteText} className="d-none d-lg-block" alt="Logo White Text" />
          
        </>
      ) : (
        <>
          <img src={LogoDarkIcon} alt="Logo Dark Icon" />
          <img src={LogoDarkText} className="d-none d-lg-block" alt="Logo Dark Text" />
        </>
      )}
    </div>
  );
};

export default AuthLogo;
