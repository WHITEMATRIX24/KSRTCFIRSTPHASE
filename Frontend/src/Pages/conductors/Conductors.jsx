import { faBan, faChevronLeft, faChevronRight, faCircleCheck, faEllipsisVertical, faGear, faLocationDot, faPlus, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import NavSidebar from '../../components/common/Sidebar/NavSidebar'
import Header from '../../components/common/Header'
import { useNavigate } from 'react-router-dom';
import { editLeaveStatusConductor, getAllConductor } from '../../services/allAPI';
import { Button, Form, Modal } from 'react-bootstrap';


const Conductors = () => {
    const [selectedConductor, setSelectedConductor] = useState("All Conductors");
    const [leaveStatus, setLeaveStatus] = useState("allstatus");

    const [activeStatus, setActiveStatus] = useState('ALL STATUSES');
    const [employmentType, setEmploymentType] = useState('Employment Type');
    const [status, setStatus] = useState('Status');
    const [conductorData, setConductorData] = useState([]);
    const [editleave, setEditLeave] = useState({ on_leave: "" });
    const [show, setShow] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const handleClose = () => setShow(false);

    const handleShow = (conductor) => {
        setCurrentId(conductor.conductor_id);
        setEditLeave({ on_leave: conductor.on_leave || "" }); // Initialize with current status
        setShow(true);
    };


    const navigate = useNavigate();

    const handleLeaveStatus = async (on_leave) => {
        const reqBody = { on_leave };
        console.log("reqBody", reqBody);


        try {
            const editStatus = await editLeaveStatusConductor(currentId, reqBody); // Use currentId directly

            if (editStatus.status === 200) {
                setEditLeave(editStatus.data);
                await handleAllConductorData(); // Refresh the conductor data
                handleClose();
            } else {
                console.log("Error at EditLeaveStatus:::::", editStatus);
            }
        } catch (err) {
            console.log("Error during the request:", err);
        }
    };


    const handleAllConductorData = async () => {
        try {
            const allConductor = await getAllConductor();
            if (allConductor.status == 200) {
                console.log(allConductor.data);
                setConductorData(allConductor.data);
            } else {
                console.log("Error in fetching Conductor Details:::::");

            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        handleAllConductorData();
    }, [])

    // const conductorsData = [
    //     { id: 1, name: 'John V', type: 'Permanent', status: 'AVAILABLE', salary: 80000, phoneNumber: '9876543210' },
    //     { id: 2, name: 'Abdul V', type: 'Temporary', status: 'ON LEAVE', salary: 85000, phoneNumber: '9876543210' },
    //     { id: 3, name: 'Vishnu V', type: 'Permanent', status: 'ON LEAVE', salary: 80000, phoneNumber: '9876543210' },
    //     { id: 4, name: 'John V', type: 'Permanent', status: 'ON LEAVE', salary: 86000, phoneNumber: '9876543210' },
    //     { id: 5, name: 'Abdul V', type: 'Temporary', status: 'AVAILABLE', salary: 82000, phoneNumber: '9876543210' },
    //     { id: 6, name: 'Vishnu V', type: 'Temporary', status: 'AVAILABLE', salary: 60000, phoneNumber: '9876543210' }

    // ];

    // const filterConductors = () => {
    //     return conductorsData.filter(conductor => {
    //         const statusMatch = activeStatus === 'ALL STATUSES' || conductor.status === activeStatus;
    //         const typeMatch = employmentType === 'Employment Type' || conductor.type === employmentType;
    //         const specificStatusMatch = status === 'Status' || conductor.status === status.toUpperCase();
    //         return statusMatch && typeMatch && specificStatusMatch;
    //     });
    // };
    // const filteredConductors = filterConductors();
    const handleAddConductor = () => {
        navigate("/add-conductor")
    }
    console.log(activeStatus);
    console.log(leaveStatus);
    const filter = (status) => {
        setActiveStatus(status)
        setLeaveStatus('allstatus')
    }


    return (
        <>
            <div className="row">
                <Header />
                <div className="col-md-2">
                    <NavSidebar />
                </div>
                <div className="col-md-9">
                    <div className='d-flex justify-content-between my-1 mx-3'>
                        <h4>Conductors</h4>
                        <button className='btn btn-success' onClick={handleAddConductor} style={{ backgroundColor: '#0d8a72', color: 'white' }}> <FontAwesomeIcon className='me-2' icon={faPlus} />ADD CONDUCTORS</button>
                    </div>

                    <hr className='vehicle-horizontal-line' />

                    <div className='d-flex'>
                        {['ALL STATUSES', 'LEAVE STATUS', 'PERMANENT', 'TEMPORARY'].map((status, index) => (
                            status === 'LEAVE STATUS' ? (
                                <div key={status} className="btn-group me-2">
                                    <button
                                        className="btn dropdown-toggle"
                                        style={{ borderBottom: activeStatus === status ? '3px solid green' : 'none' }}
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        {status.toUpperCase()}
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <button className="dropdown-item" onClick={() => setLeaveStatus('allstatus')} >Leave Status</button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item" onClick={() => setLeaveStatus('Available')} >Available</button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item" onClick={() => setLeaveStatus('Leave')}>On Leave</button>
                                        </li>

                                    </ul>

                                </div>
                            ) : (
                                <button
                                    key={index}
                                    className="btn me-md-2"
                                    style={{ borderBottom: activeStatus === status ? '3px solid green' : 'none' }}
                                    onClick={() => filter(status)}
                                >
                                    {status}
                                </button>
                            )
                        ))}
                    </div>

                    <hr className='vehicle-horizontal-line' />

                    <div className='container-fluid'>

                        {/* filter */}
                        <div className='d-flex justify-content-between py-2'>
                            <div>
                                <div className="btn-group">
                                    <button
                                        type="button"
                                        className="btn btn-light border-dark border-1 dropdown-toggle rounded px-4 me-2"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        {selectedConductor}
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <button
                                                className="dropdown-item"
                                                onClick={() => setSelectedConductor("All Conductors")}
                                            >
                                                All Conductors
                                            </button>
                                        </li>
                                        {conductorData.map((conductor) => (
                                            <li key={conductor._id}>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => setSelectedConductor(`${conductor.first_name} ${conductor.last_name}`)}
                                                >
                                                    {conductor.first_name} {conductor.last_name}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="btn-group">
                                    <button type="button" className="btn btn-light border-dark border-1 dropdown-toggle rounded px-4 me-2" data-bs-toggle="dropdown" aria-expanded="false" >{employmentType}</button>
                                    <ul className="dropdown-menu">
                                        <li><a className="dropdown-item" onClick={() => setEmploymentType('Employment Type')}>Employment Type</a></li>
                                        <li><a className="dropdown-item" onClick={() => setEmploymentType('Permanent')}>Permanent</a></li>
                                        <li><a className="dropdown-item" onClick={() => setEmploymentType('Temporary')}>Temporary</a></li>

                                    </ul>
                                </div>
                                <div className="btn-group">
                                    <button type="button" className="btn btn-light border-dark border-1 dropdown-toggle rounded px-4" data-bs-toggle="dropdown" aria-expanded="false" >{status}</button>

                                    <ul className="dropdown-menu">
                                        <li><a className="dropdown-item" onClick={() => setStatus('Status')}>Status</a></li>
                                        <li><a className="dropdown-item" onClick={() => setStatus('Available')}>Available</a></li>
                                        <li><a className="dropdown-item" onClick={() => setStatus('Leave')}>On Leave</a></li>

                                    </ul>

                                </div>
                            </div>
                            <div>
                                <button className="btn btn-light border-dark rounded" onClick={() => {
                                    setActiveStatus('ALL STATUSES');
                                    setEmploymentType('Employment Type');
                                    setStatus('Status');
                                    setSelectedConductor("All Conductors");
                                }}> <FontAwesomeIcon className='me-2' icon={faXmark} />CLEAR</button>
                            </div>
                        </div>

                        <hr className='vehicle-horizontal-line' />
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            {/* Left - gear and trash icons */}
                            <div className="d-flex gap-5 ms-5">
                                <FontAwesomeIcon icon={faGear} />
                                <FontAwesomeIcon icon={faTrashCan} />
                            </div>

                            {/* Right - Items on page, dropdown, pagination */}
                            <div className="d-flex gap-4 align-items-center me-5">
                                <p className="mb-0">Items on page</p>
                                <div className="btn-group">
                                    <button type="button" className="btn btn-light dropdown-toggle rounded px-4" data-bs-toggle="dropdown" aria-expanded="false" >10</button>
                                    <ul className="dropdown-menu">
                                        <li><a className="dropdown-item" href="#">20</a></li>
                                        <li><a className="dropdown-item" href="#">30</a></li>
                                    </ul>
                                </div>
                                <FontAwesomeIcon icon={faChevronLeft} />
                                <FontAwesomeIcon icon={faChevronRight} />
                            </div>
                        </div>

                        <div>
                            <table className="vehicle-table table w-100">
                                <thead>
                                    <tr>
                                        <th> {/*checkbox */}</th>
                                        <th> {/*image */}</th>
                                        <th>CONDUCTOR NAME</th>
                                        <th>EMPLOYMENT TYPE</th>
                                        <th>STATUS</th>
                                        <th>SALARY</th>
                                        <th>PHONE NUMBER</th>
                                        <th> {/*for map */} </th>
                                        <th> {/*for delete option */}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {conductorData
                                        .filter((conductor) => {
                                            const nameMatch =
                                                selectedConductor === "All Conductors" ||
                                                `${conductor.first_name} ${conductor.last_name}` === selectedConductor;

                                            const statusMatch = activeStatus === "ALL STATUSES" ||
                                                (activeStatus === "LEAVE STATUS" && conductor.on_leave === status) ||
                                                (activeStatus === "PERMANENT" && conductor.is_permanent === "Permanent") ||
                                                (activeStatus === "TEMPORARY" && conductor.is_permanent === "Temporary");

                                            const employmentMatch = employmentType === "Employment Type" || conductor.is_permanent === employmentType;
                                            const leaveStatusMatch = status === "Status" || conductor.on_leave === status;

                                            return nameMatch && statusMatch && employmentMatch && leaveStatusMatch;


                                        })
                                        .filter((conductor) => leaveStatus == "allstatus" ? true : leaveStatus == conductor.on_leave
                                        )
                                        .map((conductor) => (
                                            <tr key={conductor.id}>
                                                <td>
                                                    <input type="checkbox" />
                                                </td>
                                                <td>
                                                    <img src="https://english.mathrubhumi.com/image/contentid/policy:1.5293129:1644566410/image.jpg?$p=0f6e831&f=4x3&w=1080&q=0.8" alt="" height={'50px'} width={'50px'} />
                                                </td>
                                                <td>
                                                    <strong>{conductor.first_name} {conductor.last_name}</strong>
                                                    <br />
                                                    <span>{conductor.license_number}</span>
                                                </td>

                                                <td>
                                                    {conductor.is_permanent}
                                                </td>

                                                <td>
                                                    <div className=' p-2 rounded' style={{ border: '1px solid black', borderRadius: '8px', display: 'inline-block' }}>
                                                        {conductor.on_leave === 'Available' ?
                                                            (
                                                                <FontAwesomeIcon icon={faCircleCheck} style={{ color: '#189be3' }} />
                                                            )
                                                            :
                                                            (
                                                                <FontAwesomeIcon icon={faBan} style={{ color: '#db5c4d' }} />
                                                            )
                                                        }



                                                        <span className="ms-2">{conductor.on_leave}</span>
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className=' p-2' style={{ borderRadius: '8px', display: 'inline-block' }}>
                                                        ₹ INR 25,000
                                                    </div>
                                                </td>

                                                <td>
                                                    {conductor.contact_info.phone}
                                                </td>

                                                <td>
                                                    <button className='btn-primary rounded p-1 px-3' style={{ backgroundColor: '#0d8a72', color: 'white', border: 'none' }}
                                                        onClick={() => handleShow({ conductor_id: conductor._id })} >Edit</button>
                                                </td>

                                                {/* ::::::::::::Modal Section:::::::: */}

                                                <Modal show={show} onHide={handleClose} animation={false} >
                                                    <Modal.Header closeButton>
                                                        <Modal.Title>Edit Leave Status</Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>

                                                        <Form.Control as="select"
                                                            value={editleave.on_leave}
                                                            onChange={e => setEditLeave({ ...editleave, on_leave: e.target.value })} >
                                                            <option disabled value="">
                                                                Select Status
                                                            </option>
                                                            <option value={'Leave'}>Leave</option>
                                                            <option value={'Available'}>Available</option>
                                                        </Form.Control>
                                                    </Modal.Body>
                                                    <Modal.Footer>
                                                        <Button variant="secondary" onClick={handleClose}>
                                                            Close
                                                        </Button>
                                                        <Button variant="primary"
                                                            onClick={() => handleLeaveStatus(editleave.on_leave)}
                                                        >
                                                            Save Changes
                                                        </Button>
                                                    </Modal.Footer>
                                                </Modal>



                                                <td>
                                                    <FontAwesomeIcon icon={faEllipsisVertical} />
                                                </td>

                                            </tr>
                                        ))
                                    }

                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>

                <div className="col-md-1"></div>
            </div>
        </>
    )
}

export default Conductors