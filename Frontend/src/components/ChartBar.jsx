import React, { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  getAllCollectionAPi,
  getCollectionByDepoAPi,
} from "../services/allAPI";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function ChartBar({ collection, fuelconsumtion, revenew }) {
  console.log("from dash", collection, fuelconsumtion, revenew);

  const [depoName, setDepoName] = useState("");
  const [totalDepoCollect, setTotalDepoCollection] = useState(0);
  const [totalDepoFuel, setTotalDepoFuel] = useState(0);
  const [currentMonthYear, setCurrentMonthYear] = useState("");

  // <<<<:::This UseEffect used to store depo Name from SessionStorage::::>>>>
  useEffect(() => {
    // const depo = JSON.parse(sessionStorage.getItem("user"));
    // if (depo) {
    //   setDepoName(depo.depoName);
    // } else {
    //   console.log("Cannot find DepoName::::");
    // }
    const date = new Date();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    setCurrentMonthYear(`${month} ${year}`);
  }, []);

  // <<<::::This useEffect used to check the condition (isAdmin || Not)::::>>>>>
  // useEffect(() => {
  //   if (depoName) {
  //     if (depoName !== "Admin") {
  //       getDepoCollectionData();
  //     } else {
  //       getAdminCollectionData();
  //     }
  //   }
  // }, [depoName]);

  //<<<::::getting only depo based collection details to display in Not Admin Logined DashBoards::::>>>
  const getDepoCollectionData = async () => {
    try {
      const depoData = await getCollectionByDepoAPi(depoName);
      if (depoData.status === 200) {
        const totalCollection = depoData.data.reduce(
          (sum, item) => sum + item.Tripcollection,
          0
        );
        const totalFuelConsumption = depoData.data.reduce(
          (sum, item) => sum + item.fuelCost,
          0
        );
        setTotalDepoCollection(totalCollection);
        setTotalDepoFuel(totalFuelConsumption);
      } else {
        console.log(depoData.status);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //<<<::::Calling All collection detailsto display in Admin Logined DashBoard::::>>>
  const getAdminCollectionData = async () => {
    try {
      const adminData = await getAllCollectionAPi();

      if (adminData.status === 200) {
        const totalCollection = adminData.data.reduce(
          (sum, item) => sum + item.Tripcollection,
          0
        );
        const totalFuelConsumption = adminData.data.reduce(
          (sum, item) => sum + item.fuelCost,
          0
        );
        setTotalDepoCollection(totalCollection);
        setTotalDepoFuel(totalFuelConsumption);
      } else {
        console.log(adminData.status);
      }
    } catch (err) {
      console.log(err);
    }
  };
  // console.log(totalDepoCollect, totalDepoFuel);
  // console.log(depoName);

  // useEffect(() => {
  //   if (collection || fuelconsumtion || revenew) {
  //     setTotalDepoCollection(collection);
  //     setTotalDepoFuel(fuelconsumtion);
  //   }
  // }, [collection, fuelconsumtion, revenew]);

  return (
    <div className="m-5" style={{ width: "450px", height: "250px" }}>
      <Bar
        width={350}
        height={300}
        data={{
          labels: [currentMonthYear],
          datasets: [
            {
              label: "Expense",
              data: [fuelconsumtion && fuelconsumtion],
              // data:fuelconsumtion,
              backgroundColor: "#0d8a72",
              borderColor: "rgba(255, 99, 132, 1)",
              // backgroundColor: [
              //   '#0d8a72',
              //   ' #37bc7f',
              //   ' #ffb94d',
              //   // 'rgba(75, 192, 192, 0.2)',
              //   // 'rgba(153, 102, 255, 0.2)',
              //   // 'rgba(255, 159, 64, 0.2)',
              // ],
              // borderColor: [
              //   'rgba(255, 99, 132, 1)',
              //   'rgba(54, 162, 235, 1)',
              //   'rgba(255, 206, 86, 1)',
              //   // 'rgba(75, 192, 192, 1)',
              //   // 'rgba(153, 102, 255, 1)',
              //   // 'rgba(255, 159, 64, 1)',
              // ],
              borderWidth: 1,
            },
            {
              label: "Collection",
              data: [collection && collection],
              backgroundColor: " #37bc7f",
              borderColor: "rgba(54, 162, 235, 1)",
            },
            {
              label: "Profit",
              data: [revenew && revenew],
              backgroundColor: " #ffb94d",
              borderColor: "rgba(255, 206, 86, 1)",
              borderWidth: 1,
            },
          ],
        }}
        options={{
          responsive: true,
        }}
      />
    </div>
  );
}

export default ChartBar;
