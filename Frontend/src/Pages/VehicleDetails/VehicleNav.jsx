import React from 'react';
import './VehicleNav.css';

const VehicleNav = () => {
    return (
        <div className='Navbar-main-container row col-12'>
            <div className='col-2'></div>
            <div className="navLinks col-2 ">
                <a href="#" className='text-success navlinks-a'>Back to All Vehicles</a>
            </div>
            <div className="navButtons d-flex justify-content-end  col-8">
                <button className='btn text-success nav-event-button'><i className="fa-solid fa-star nav-event-icon pe-2 m-0"></i>Event</button>
                <button className='btn text-success btn-success text-light nav-vehicle-button'><i className="fa-solid fa-plus bg-success pe-2 m-0"></i>ADD VEHICLE</button>
            </div>
        </div>
    );
}

export default VehicleNav;
