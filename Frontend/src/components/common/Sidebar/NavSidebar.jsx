import { faAngleDown, faAngleLeft, faBars, faBookOpen, faChartPie, faDriversLicense, faGear, faTruck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import Navbar from 'react-bootstrap/Navbar';
import './Sidebar.css'
import Divider from '@mui/material/Divider';
import { Link } from 'react-router-dom';

function NavSidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null)

  const toggleSubmenu = (menu) => {
    activeMenu != null && (document.getElementById(activeMenu).style.color = '#818181')
    if (activeMenu === menu) { document.getElementById(menu).style.color = '#818181' }
    else { document.getElementById(menu).style.color = 'green' }
    setActiveSubmenu(activeMenu === menu ? null : activeMenu);
    setActiveMenu(activeMenu === menu ? null : menu);

  };

  const toggelColor = (submenu) => {
    activeSubmenu !== null && (document.getElementById(activeSubmenu).style.color = '#818181')
    document.getElementById(submenu).style.color = 'green'
    setActiveSubmenu(submenu);
  }
  return (
    <ul className="sidebar-menu  w-100">
      <li>

        <div className='d-flex '>
          <a href="#" id='dashboard' className={`mb-3 ${activeMenu === 'dashboard' && "selectedmenu"}`} onClick={() => toggleSubmenu('dashboard')}>
            <FontAwesomeIcon icon={faBookOpen} /> Dashboard
            {activeMenu !== 'dashboard' && (<FontAwesomeIcon className='ms-2' icon={faAngleDown} />)}
            {activeMenu === 'dashboard' && (<FontAwesomeIcon className='ms-2' icon={faAngleLeft} />)}
          </a>
        </div>
        <Divider />
        {activeMenu === 'dashboard' && (
          <ul className="submenu">
            {/* <li><a href="#" id='vehiclesoverview' className='my-1' onClick={() => toggelColor('vehiclesoverview')}>Vehicles Overview</a></li>
            <Divider /> */}

            <li><a href="/dashboard" className='my-1' id='realTimeData' onClick={() => toggelColor('realTimeData')}>Real Time Data</a></li>
            <Divider />
            {/* <li><a href="#" className='my-1' id='Events' onClick={() => toggelColor('Events')}>Events</a></li>
            <Divider /> */}
          </ul>
        )}
      </li>
      <li>
        <a href="#" id='vehicles' className='my-2' onClick={() => toggleSubmenu('vehicles')}>
          <FontAwesomeIcon className='me-2' icon={faTruck} />Vehicles
          {activeMenu !== 'vehicles' && (<FontAwesomeIcon className='ms-2' icon={faAngleDown} />)}
          {activeMenu === 'vehicles' && (<FontAwesomeIcon className='ms-2' icon={faAngleLeft} />)}
        </a>
        <Divider />
        {activeMenu === 'vehicles' && (
          <ul className="submenu">
            <li><a href="/fleet" className='my-2' id='Fleet' onClick={() => toggelColor('Fleet')}>Fleet</a></li>
            <Divider />

            {/* <li><a href="#" className='my-2' id='vAssignment' onClick={() => toggelColor('vAssignment')}>Vehicles Assignment</a></li>
            <Divider />
            <li><a href="/vehicle-details" className='my-2' id='vDetails' onClick={() => toggelColor('vDetails')}>Vehicle Details</a></li>
            <Divider /> */}
          </ul>
        )}
      </li>
      <li>
        <a href="#" id='trips' className='my-2' onClick={() => toggleSubmenu('trips')}>
          <FontAwesomeIcon className='me-2' icon={faBookOpen} />Trips
          {activeMenu !== 'trips' && (<FontAwesomeIcon className='ms-2' icon={faAngleDown} />)}
          {activeMenu === 'trips' && (<FontAwesomeIcon className='ms-2' icon={faAngleLeft} />)}
        </a>
        <Divider />
        {activeMenu === 'trips' && (
          <ul className="submenu">
            <li><Link to="/trip-overview" className='my-2' id='vehiclesoverview' onClick={() => toggelColor('vehiclesoverview')}>Overview</Link></li>
            <li><a href="/scheduled-trips" className='my-2' id='Upcoming' onClick={() => toggelColor('Upcoming')}>Upcoming</a></li> <Divider />
            <li><a href="/add-trip" className='my-2' id='Scheduled' onClick={() => toggelColor('Scheduled')}>Schedule</a></li> <Divider />
            <li><a href="/ongoing-trips" className='my-2' id='Ongoing' onClick={() => toggelColor('Ongoing')}>OnGoing</a></li> <Divider />

          </ul>
        )}
      </li>
      <li>
        <a href="#" className='my-2' id='staffs' onClick={() => toggleSubmenu('staffs')}>
          <FontAwesomeIcon className='me-2' icon={faDriversLicense} />Staffs
          {activeMenu !== 'staffs' && (<FontAwesomeIcon className='ms-2' icon={faAngleDown} />)}
          {activeMenu === 'staffs' && (<FontAwesomeIcon className='ms-2' icon={faAngleLeft} />)}
        </a> <Divider />
        {activeMenu === 'staffs' && (
          <ul className="submenu">
            <li><a href="/driver" id='Driver' onClick={() => toggelColor('Driver')}>Drivers</a></li> <Divider />
            <li><a href="/conductor" id='Conductor' className='my-2' onClick={() => toggelColor('Conductor')}>Conductors</a></li>
            <Divider />
          </ul>
        )}
      </li>

      <li>
        <a href="#" className='my-2' id='maintenance' onClick={() => toggleSubmenu('maintenance')}>
          <FontAwesomeIcon className='me-2' icon={faGear} /> Maintenance
          {activeMenu !== 'maintenance' && (<FontAwesomeIcon className='ms-2' icon={faAngleDown} />)}
          {activeMenu === 'maintenance' && (<FontAwesomeIcon className='ms-2' icon={faAngleLeft} />)}
        </a>
        <Divider />
        {activeMenu === 'maintenance' && (
          <ul className="submenu">
            <li><a href="/maintenance" id='maintenancePlanner' className='my-2' onClick={() => toggelColor('maintenancePlanner')}>Maintenance Planner</a></li>
            <Divider />
            <li><a href="#" className='my-2' id='history' onClick={() => toggelColor('history')}>History</a></li>
            <Divider />
          </ul>
        )}
      </li>
      <li>
        <a href="#" className='my-2' id='analytics' onClick={() => toggleSubmenu('analytics')}>
          <FontAwesomeIcon className='me-2' icon={faChartPie} />Analytics
        </a>
        <Divider />
      </li>
    </ul>


  )
}

export default NavSidebar
