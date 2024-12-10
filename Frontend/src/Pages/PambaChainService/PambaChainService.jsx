import React, { useEffect, useState } from "react";
import Header from "../../components/common/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Row, Col, Form, Table, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import {
  AddChainCollectionAPI,
  getAllChainCollectionAPI,
} from "../../services/allAPI";

function PambaChainService() {
  const [collectionDetails, setCollectionDetails] = useState({
    date: "",
    depot: "",
    numberOfTrips: "",
    numberOfBuses: "",
    numberOfStaffs: "",
  });
  const [showAddCollection, setShowAddCollection] = useState(false);
  const [allCollections, setAllCollections] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [originalCollections, setOriginalCollections] = useState([]);
  const [depoFilter, setDepoFilter] = useState();
  const [depo, setDepo] = useState("");
  const [role, setRole] = useState("");
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(false);
  const [TotalTrip, setTotalTrip] = useState();
  const [TotalBuses, setTotalBuses] = useState();
  const [TotalStaff, setTotalStaff] = useState();

  const handleShow = () => {
    setShowAddCollection(true);
  };
  const handleCancel = () => {
    setShowAddCollection(false);
    setCollectionDetails({
      date: "",
      numberOfTrips: "",
      numberOfBuses: "",
      numberOfStaffs: "",
    });
  };
  console.log(collectionDetails);

  const handleSave = async () => {
    console.log(depo);
    console.log(collectionDetails);

    if (
      !collectionDetails.date ||
      !collectionDetails.numberOfBuses ||
      !collectionDetails.numberOfStaffs
    ) {
      alert("Please Fill All Details");
    } else {
      const result = await AddChainCollectionAPI(collectionDetails);
      console.log(result);
      if (result.status == 201) {
        alert("Chain Collection Details Added Successfully");
        handleCancel();
        getCollection();
      } else {
        console.log("Error in Adding Data");
      }
    }
  };

  const getCollection = async () => {
    setLoading(true);
    try {
      const result = await getAllChainCollectionAPI("");

      if (result?.status === 200) {
        setOriginalCollections(result.data);
        setAllCollections(result.data);
      } else {
        console.log("Failed to fetch");
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userDetails = JSON.parse(sessionStorage.getItem("user"));
    setDepo(userDetails.depoName);
    setRole(userDetails.role);
    setCollectionDetails({ ...collectionDetails, depot: depo });
  }, [allCollections]);

  useEffect(() => {
    getCollection();
  }, []);

  useEffect(() => {
    let TotalTrip = 0;
    let TotalBuses = 0;
    let TotalStaff = 0;

    allCollections.map((item) => {
      TotalTrip = Number(item.numberOfTrips) + TotalTrip;
      setTotalTrip(TotalTrip);
      TotalBuses = Number(item.numberOfBuses) + TotalBuses;
      setTotalBuses(TotalBuses);
      TotalStaff = Number(item.numberOfStaffs) + TotalStaff;
      setTotalStaff(TotalStaff);
    });
  }, [allCollections]);
  return (
    <>
      <Header />
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-10" style={{ backgroundColor: "#f8f9fa" }}>
          <div className="d-flex justify-content-between my-3 mx-3">
            <h4>Chain Service Collection</h4>

            {JSON.parse(sessionStorage.getItem("user")).role != "Admin" && (
              <button
                className="btn btn-success"
                onClick={handleShow}
                style={{ backgroundColor: "#0d8a72", color: "white" }}
              >
                {" "}
                <FontAwesomeIcon className="me-2" icon={faPlus} />
                ADD CHAIN SERVICE
              </button>
            )}
          </div>
          {/* Filters */}
          <Row className="mb-3 mx-3 align-items-center">
            <Col md={3}>
              <Form.Control
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </Col>
            <Col md={6} className="text-end">
              <Button
                variant="link"
                onClick={() => {
                  setDepoFilter("");
                  setDateFilter("");
                }}
              >
                CLEAR
              </Button>
            </Col>
          </Row>
          <hr className="my-3" />
          {/* Toolbar with count of items */}
          <Row className="mx-3 my-5" style={{ fontSize: "18px" }}>
            {
              <Col md={4} className="">
                {/* Displaying the count of filtered items */}
                <span>Total Trip:</span>
                <span className="text-info ms-2 me-5"> {TotalTrip}</span>
              </Col>
            }
            {
              <Col md={4} className="text-end">
                {/* Displaying the count of filtered items */}
                <span>Total No of Buses:</span>
                <span className="text-info ms-2 me-5"> {TotalBuses}</span>
              </Col>
            }
            {
              <Col md={4} className="text-end">
                {/* Displaying the count of filtered items */}
                <span>Total No of Staff:</span>
                <span className="text-info ms-2 me-5"> {TotalStaff}</span>
              </Col>
            }
          </Row>
          {/* Table */}
          {/*               {loading && busLoading && <div>
           */}{" "}
          {allCollections?.length > 0 && (
            <Row>
              <Col md={1}></Col>
              <Col md={8}>
                <Table
                  hover
                  responsive
                  className="align-middle"
                  style={{ borderSpacing: "0 10px" }}
                >
                  <thead className="">
                    <tr className="bg-light">
                      <th>DATE</th>
                      <th>TRIPS</th>
                      <th>BUSES</th>
                      <th>STAFFS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allCollections
                      .filter((item) =>
                        !dateFilter
                          ? true
                          : dateFilter == item.date.split("T")[0]
                      )
                      .reverse()
                      .map((item) => (
                        <tr key={item._id} className="bg-white">
                          <td>{new Date(item.date).toLocaleDateString()}</td>
                          <td>{item.numberOfTrips}</td>
                          <td>{item.numberOfBuses}</td>
                          <td>{item.numberOfStaffs}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Col>
              <Col md={1}></Col>
            </Row>
          )}
          {allCollections?.length == 0 && (
            <h6 className="text-danger text-center m-3">No Collection Added</h6>
          )}
        </div>

        <Modal show={showAddCollection} onHide={handleCancel}>
          <Modal.Header closeButton>
            <Modal.Title>Add Chain Service Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <Form.Label className="mb-1" style={{ fontSize: "14px" }}>
                Date
              </Form.Label>
              <Form.Control
                type="date"
                placeholder="Select Date"
                value={collectionDetails.date}
                onChange={(e) =>
                  setCollectionDetails({
                    ...collectionDetails,
                    date: e.target.value,
                  })
                }
              />
            </div>

            <div className="mt-2">
              <Form.Label className="mb-1" style={{ fontSize: "14px" }}>
                Total Trip
              </Form.Label>
              <input
                type="text"
                className="form-control"
                value={collectionDetails.numberOfTrips}
                onChange={(e) =>
                  setCollectionDetails({
                    ...collectionDetails,
                    numberOfTrips: e.target.value,
                  })
                }
              />
            </div>

            <div className="mt-2">
              <Form.Label className="mb-1" style={{ fontSize: "14px" }}>
                Total No. of Buses
              </Form.Label>
              <input
                type="text"
                className="form-control"
                value={collectionDetails.numberOfBuses}
                onChange={(e) =>
                  setCollectionDetails({
                    ...collectionDetails,
                    numberOfBuses: e.target.value,
                  })
                }
              />
            </div>
            <div className="mt-2">
              <Form.Label className="mb-1" style={{ fontSize: "14px" }}>
                Total No. of Staff
              </Form.Label>
              <input
                type="text"
                className="form-control"
                value={collectionDetails.numberOfStaffs}
                onChange={(e) =>
                  setCollectionDetails({
                    ...collectionDetails,
                    numberOfStaffs: e.target.value,
                  })
                }
              />
              <p className="text-danger mb-0 mt-3">
                *Pamba collection can be added in collection tab
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleCancel} variant="secondary">
              Close
            </Button>
            <Button onClick={handleSave} variant="danger">
              Confirm Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default PambaChainService;
