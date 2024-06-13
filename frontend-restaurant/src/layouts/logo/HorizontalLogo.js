import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import React from 'react';
import  LogoDarkIcon  from '../../assets/images/logos/1.png';
import LogoDarkText from '../../assets/images/logos/logoD.png';
import LogoWhiteText  from '../../assets/images/logos/logoW.png';
import LogoWhiteIcon  from '../../assets/images/logos/2.png';

const HorizontalLogo = () => {
  const isDarkMode = useSelector((state) => state.customizer.isDark);
  const activetopbarBg = useSelector((state) => state.customizer.topbarBg);
  return (
    <Link to="#" className="d-flex align-items-center gap-2">
      {isDarkMode || activetopbarBg !== 'white' ? (
        <>

          <img src={LogoWhiteIcon} alt="Logo White Icon" width={60}/>
          <img src={LogoWhiteText} className="d-none d-lg-block" alt="Logo White Text" width={120}/>
        </>
      ) : (
        <>
          <img src={LogoDarkIcon} alt="Logo Dark Icon" width={60}/>
          <img src={LogoDarkText} className="d-none d-lg-block" alt="Logo Dark Text" width={120} />

        </>
      )}
    </Link>
  );
};

export default HorizontalLogo;
