/* Header contains navbar sidebar and Realtime data */


import { faAngleDown, faBars, faBookOpen, faChartPie, faDriversLicense, faGear, faTruck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import Navbar from 'react-bootstrap/Navbar';
import './Header.css'
import Divider from '@mui/material/Divider';
import NavSidebar from './Sidebar/NavSidebar';
import RealTimeData from '../RealTimeData/RealTimeData';
import logo from '../../assets/logoKSRTC.png'
import { useNavigate } from 'react-router-dom';

function Header() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [logOutBtn,setLogOutBtn]=useState(false);
  const [userData,setUserData]=useState({});
  const navigate =useNavigate()

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const handleLogOutButton=()=>setLogOutBtn(!logOutBtn);
  const handleLogOut=()=>{
    sessionStorage.clear();
    setUserData('');
    navigate("/");
  }

  const toggleSubmenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  useEffect(()=>{
    const userDetails=JSON.parse(sessionStorage.getItem("user"));
    console.log("User",userDetails);
    setUserData(userDetails)
  },[])


  return (
    <>
      <Navbar collapseOnSelect expand="md" className="m-0 p-0 " style={{ background: '#DB2C07', zIndex: '5', position: "sticky", top: "0px" }}>

        <Navbar.Brand className='w-100 d-flex px-3' href="#home">
          <img
            alt=""
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          <h4 className='text-light ps-3'>K-TRACK "Enroute Kerala"</h4>
{/*           <h4 className='ms-3 text-light'><FontAwesomeIcon icon={faBars} onClick={toggleNav} /></h4>
 */}        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
          <Navbar.Text className='d-flex border-start ps-2 pe-3 align-items-center justify-content-center '>
            <img className='UserImage' src={logo} alt="" />
            <div className='d-flex w-100 align-items-start    flex-column' style={{ lineHeight: '5px' }}>
              <p className='text-light ms-2'>{userData.userName}</p>
              <p className='text-light ms-2'>{userData.role}</p>
            </div>

           <div className="">
           <p className='px-3'><FontAwesomeIcon icon={faAngleDown} onClick={handleLogOutButton}/></p>
           </div>

          </Navbar.Text>
        </Navbar.Collapse>

      </Navbar>
      {logOutBtn? 
          <div className="LogoutBtnCvr">
            <button className='logOutBtn' onClick={handleLogOut}>
              Logout</button>
           </div>:""}
      <div className='row w-100'>
        {isOpen && <div className={`col-md-2 col-sm-12 sidenav shadow ${isOpen ? 'open' : ''}`}>
          <NavSidebar />
        </div>}

      </div>




    </>
  )
}

export default Header
