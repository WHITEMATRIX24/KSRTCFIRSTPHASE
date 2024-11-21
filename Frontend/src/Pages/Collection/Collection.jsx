import React, { useEffect, useState } from "react";
import Header from "../../components/common/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import {
  AddCollectionAPi,
  getAllCollectionAPi,
  getCollectionByDepoAPi,
} from "../../services/allAPI";
import { all } from "axios";

function Collection() {
  const [collectionDetails, setCollectionDetails] = useState({
    date: "",
    depot: "",
    Tripcollection: "",
    fuelCost: "",
    numOfPassengers: "",
  });
  const [showAddCollection, setShowAddCollection] = useState(false);

  const [allCollections, setAllCollections] = useState([]);

  const handleShow = () => {
    setShowAddCollection(true);
  };
  const handleCancel = () => {
    setShowAddCollection(false);
    setCollectionDetails({
      date: "",
      depot: "",
      Tripcollection: "",
      fuelCost: "",
      numOfPassengers: "",
    });
  };

  const handleSave = async () => {
    setCollectionDetails({ ...collectionDetails, depot: depo });
    console.log(collectionDetails);

    if (
      !collectionDetails.date ||
      !collectionDetails.Tripcollection ||
      !collectionDetails.fuelCost ||
      !collectionDetails.numOfPassengers
    ) {
      alert("Please Fill All Details");
    } else {
      const result = await AddCollectionAPi(collectionDetails);
      console.log(result);
      if (result.status == 201) {
        alert("Collection Details Added Successfully");
        handleCancel();
        getCollection();
      } else {
        alert("Error in Adding Data");
      }
    }
  };

  const [depo, setDepo] = useState("");
  const [role, setRole] = useState("");
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toatlCollection, setTotalCollection] = useState();

  const getCollection = async () => {
    if (role == "Staff") {
      setIsStaff(true);

      const result = await getCollectionByDepoAPi(depo);
      console.log(result.data);

      if (result.status == 200) {
        setLoading(true);
        setAllCollections(result.data);
      } else {
        alert("Failed to Load Collection Details");
      }
    } else if (role == "Admin") {
      const result = await getAllCollectionAPi();
      if (result.status == 200) {
        setAllCollections(result.data);
        setLoading(true);
      } else {
        alert("Failed to Load Collection Details");
      }
    }
  };
  useEffect(() => {
    const userDetails = JSON.parse(sessionStorage.getItem("user"));
    console.log("User", userDetails);
    setDepo(userDetails.depoName);
    setRole(userDetails.role);
  }, []);

  useEffect(() => {
    getCollection();
  }, [depo]);
  const [depoFilter, setDepoFilter] = useState();
  const [TotalFuel, setTotalFuel] = useState();
  const [TotalPassenger, setTotalPassenger] = useState();

  const filter = () => {
    if (depoFilter == "") {
      getCollection();
    } else {
      const filtered = allCollections.filter((item) => {
        const matchesDepo =
          item.depot &&
          item.depot.toLowerCase().includes(depoFilter.toLowerCase());
        return matchesDepo;
      });
      setAllCollections([...filtered]);
    }
  };

  useEffect(() => {
    filter();
  }, [depoFilter]);

  useEffect(() => {
    let TotalColl = 0;
    let TotalFu = 0;
    let TotalPass = 0;

    allCollections.map((item) => {
      console.log(item);

      TotalColl = Number(item.Tripcollection) + TotalColl;
      setTotalCollection(TotalColl);
      TotalFu = Number(item.fuelCost) + TotalFu;
      setTotalFuel(TotalFu);
      TotalPass = Number(item.numOfPassengers) + TotalPass;
      setTotalPassenger(TotalPass);
    });
  }, [allCollections]);

  return (
    <>
      <Header />
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-10" style={{ backgroundColor: "#f8f9fa" }}>
          <div className="d-flex justify-content-between my-3 mx-3">
            <h4>Collection</h4>

            <button
              className="btn btn-success"
              onClick={handleShow}
              style={{ backgroundColor: "#0d8a72", color: "white" }}
            >
              {" "}
              <FontAwesomeIcon className="me-2" icon={faPlus} />
              ADD COLLECTION
            </button>
          </div>
          {/* Filters */}
          {!isStaff && (
            <Row className="mb-3 mx-3 align-items-center">
              <Col md={3}>
                <Form.Control
                  type="text"
                  placeholder="Enter Depo"
                  value={depoFilter}
                  onChange={(e) => setDepoFilter(e.target.value)}
                />
              </Col>
              <Col md={2}></Col>
              <Col md={6} className="text-end">
                <Button
                  variant="link"
                  className="text-muted"
                  onClick={() => {
                    setDepoFilter("");
                  }}
                >
                  CLEAR
                </Button>
              </Col>
            </Row>
          )}
          <hr className="my-3" />
          {/* Toolbar with count of items */}
          <Row className="mx-3 my-5" style={{ fontSize: "18px" }}>
            {
              <Col md={4} className="">
                {/* Displaying the count of filtered items */}
                <span>Total Collection:</span>
                <span className="text-info ms-2 me-5"> {toatlCollection}</span>
              </Col>
            }
            {
              <Col md={4} className="text-end">
                {/* Displaying the count of filtered items */}
                <span>Total Fuel Cost:</span>
                <span className="text-info ms-2 me-5"> {TotalFuel}</span>
              </Col>
            }
            {
              <Col md={4} className="text-end">
                {/* Displaying the count of filtered items */}
                <span>Total Passengers:</span>
                <span className="text-info ms-2 me-5"> {TotalPassenger}</span>
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
                      {/* <th>TRIPID</th> */}
                      {!isStaff && <th>DEPO</th>}
                      <th>DATE</th>
                      <th>COLLECTION</th>
                      <th>FUEL COST</th>
                      <th>PASSENGERS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allCollections.map((item) => (
                      <tr key={item._id} className="bg-white">
                        {/* <td>
                                {item._id}
                              </td> */}
                        {!isStaff && <td>{item.depot}</td>}
                        <td>{new Date(item.date).toLocaleDateString()}</td>
                        <td>{item.Tripcollection}</td>
                        <td>{item.fuelCost}</td>
                        <td>{item.numOfPassengers}</td>
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
            <Modal.Title>Add Collection Details</Modal.Title>
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
                Total Collection
              </Form.Label>
              <input
                type="text"
                className="form-control"
                value={collectionDetails.Tripcollection}
                onChange={(e) =>
                  setCollectionDetails({
                    ...collectionDetails,
                    Tripcollection: e.target.value,
                  })
                }
              />
            </div>
            <div className="mt-2">
              <Form.Label className="mb-1" style={{ fontSize: "14px" }}>
                Total Fuel Cost
              </Form.Label>
              <input
                type="text"
                className="form-control"
                value={collectionDetails.fuelCost}
                onChange={(e) =>
                  setCollectionDetails({
                    ...collectionDetails,
                    fuelCost: e.target.value,
                  })
                }
              />
            </div>
            <div className="mt-2">
              <Form.Label className="mb-1" style={{ fontSize: "14px" }}>
                Total No. of Passengers
              </Form.Label>
              <input
                type="text"
                className="form-control"
                value={collectionDetails.numOfPassengers}
                onChange={(e) =>
                  setCollectionDetails({
                    ...collectionDetails,
                    numOfPassengers: e.target.value,
                  })
                }
              />
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

export default Collection;
