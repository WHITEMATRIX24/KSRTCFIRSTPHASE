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
import { TextField } from "@mui/material";

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
  const [dateFilter, setDateFilter] = useState("");
  const [originalCollections, setOriginalCollections] = useState([]);
  const [depoFilter, setDepoFilter] = useState();
  const [TotalFuel, setTotalFuel] = useState();
  const [TotalPassenger, setTotalPassenger] = useState();
  const [depo, setDepo] = useState("");
  const [role, setRole] = useState("");
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toatlCollection, setTotalCollection] = useState();
  const [inputPairs, setInputPairs] = useState([]);
  const [fuel, setFuel] = useState([]);
  const [fuelCost, setFuelCost] = useState(0);

  const handleShow = () => {
    setShowAddCollection(true);
  };
  const handleCancel = () => {
    setShowAddCollection(false);
    setCollectionDetails({
      date: "",
      Tripcollection: "",
      fuelCost: "",
      numOfPassengers: "",
    });
    setInputPairs([]);
    setFuel([]);
    setFuelCost(0);
  };

  const handleSave = async () => {
    console.log(depo);

    // setCollectionDetails({ ...collectionDetails, depot: depo });
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

  const getCollection = async () => {
    setLoading(true);
    try {
      let result;
      if (role === "Staff" || role === "Supervisor") {
        setIsStaff(true);
        result = await getCollectionByDepoAPi(depo);
      } else if (role === "Admin") {
        result = await getAllCollectionAPi();
      }

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

  const filterByDepo = () => {
    if (!depoFilter) {
      setAllCollections([...originalCollections]);
    } else {
      const filtered = originalCollections.filter((item) =>
        item.depot?.toLowerCase().includes(depoFilter.toLowerCase())
      );
      setAllCollections(filtered);
    }
  };

  const filterByDate = () => {
    if (!dateFilter) {
      setAllCollections([...originalCollections]);
    } else {
      const filtered = originalCollections.filter((item) => {
        const dbDate = new Date(item.date).toISOString().slice(0, 10); // Normalize date to YYYY-MM-DD
        const filterDate = new Date(dateFilter).toISOString().slice(0, 10); // Same normalization
        return dbDate === filterDate; // Direct comparison
      });
      setAllCollections(filtered);
    }
  };

  useEffect(() => {
    filterByDepo();
  }, [depoFilter]);

  useEffect(() => {
    filterByDate();
  }, [dateFilter]);

  useEffect(() => {
    const userDetails = JSON.parse(sessionStorage.getItem("user"));
    console.log("User", userDetails);
    setDepo(userDetails.depoName);
    setRole(userDetails.role);
    setCollectionDetails({ ...collectionDetails, depot: depo });
  }, [allCollections]);

  useEffect(() => {
    getCollection();
  }, [depo]);

  /* <<<<<<< Fuel Cost Functionality>>>>> */

  /* Function to add input boxes for entering fuel charge */
  const handleButtonClick = () => {
    // Add a new pair of input fields, each with its own state for the values
    setInputPairs([...inputPairs, { liter: "", rate: "", total: "" }]);
  };

  /* Function to save fuel charge */
  const handleInputChange = (index, field, event) => {
    // Update the value of either input1 or input2 for a specific input pair
    const newInputPairs = [...inputPairs];
    let newFuel = fuel;
    let fuelCharge = 0;
    newInputPairs[index][field] = event.target.value;
    newInputPairs[index]["total"] =
      newInputPairs[index]["liter"] * newInputPairs[index]["rate"];
    fuel[index] = newInputPairs[index]["total"];
    setInputPairs(newInputPairs);
    setFuel(newFuel);
    fuelCharge = newFuel.reduce((a, b) => a + b);

    setFuelCost(fuelCharge);
    setCollectionDetails({ ...collectionDetails, fuelCost: fuelCharge });
  };

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

            {isStaff && (
              <button
                className="btn btn-success"
                onClick={handleShow}
                style={{ backgroundColor: "#0d8a72", color: "white" }}
              >
                {" "}
                <FontAwesomeIcon className="me-2" icon={faPlus} />
                ADD COLLECTION
              </button>
            )}
          </div>
          {/* Filters */}
          <Row className="mb-3 mx-3 align-items-center">
            {!isStaff && (
              <Col md={3}>
                <Form.Control
                  type="text"
                  placeholder="Enter Depo"
                  value={depoFilter}
                  onChange={(e) => setDepoFilter(e.target.value)}
                />
              </Col>
            )}
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
                <span>Total Collection:</span>
                <span className="text-info ms-2 me-5"> {toatlCollection}</span>
              </Col>
            }
            {
              <Col md={4} className="text-end">
                {/* Displaying the count of filtered items */}
                <span>Total Fuel Cost:</span>
                <span className="text-info ms-2 me-5">
                  {" "}
                  {TotalFuel && parseFloat(TotalFuel.toFixed(2))}
                </span>
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

            <>
              <button
                className="btn btn-outline-warning m-3"
                onClick={handleButtonClick}
              >
                Add Fuel Cost
              </button>
              {/* Render each input pair */}
              {inputPairs.map((pair, index) => (
                <div
                  key={index}
                  className="d-flex"
                  style={{ marginBottom: "10px" }}
                >
                  <TextField
                    required
                    id="outlined-required"
                    name="liter"
                    label="Fuel in Liter "
                    className="w-25     me-3"
                    value={pair.input1}
                    onChange={(e) => handleInputChange(index, "liter", e)}
                    placeholder={`Liters`}
                  />

                  <TextField
                    required
                    id="outlined-required"
                    name="liter"
                    label="Fuel Rate "
                    className="w-25     me-3"
                    value={pair.input2}
                    onChange={(e) => handleInputChange(index, "rate", e)}
                    placeholder={`₹ 0`}
                  />

                  <TextField
                    readOnly
                    label="Total "
                    id="outlined-required"
                    name="Total"
                    className=" form-control w-25"
                    value={pair.total}
                    placeholder={`₹ 0`}
                  />
                </div>
              ))}
              <br />
              <Form.Label className="mb-1" style={{ fontSize: "14px" }}>
                Total Fuel Cost
              </Form.Label>
              <input
                className="form-control w-100 text-danger fs-5"
                type="text"
                readOnly
                value={`₹ ${fuelCost} `}
                placeholder="₹ 0"
              />{" "}
            </>

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
