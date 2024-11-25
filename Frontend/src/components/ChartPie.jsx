import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import {
  getAllOutofServicesApi,
  getAvilableServicesApi,
  getOnRouteServicesApi,
} from "../services/allAPI";
ChartJS.register(ArcElement, Tooltip, Legend);

function ChartPie({ data }) {
  // console.log("data from pie", data);
  const [outOfServicesCount, setOutOfServicesCount] = useState(0);
  const [avilableCount, setAvilableCount] = useState(0);
  const [onRouteCount, setOnRouteCount] = useState(0);
  // out of services
  const getOutOfServicesCount = async () => {
    const result = await getAllOutofServicesApi();
    console.log(result);
    const count = result.data.length;
    setOutOfServicesCount(count);
  };

  // Avilable Services
  const getAvilableServicesCount = async () => {
    const result = await getAvilableServicesApi();
    console.log(result);
    const count = result.data.length;
    setAvilableCount(count);
  };

  // On route Services
  const getOnRouteServicesCount = async () => {
    const result = await getOnRouteServicesApi();
    console.log(result);
    const count = result.data.length;
    setOnRouteCount(count);
  };

  // useEffect(() => {
  //   getOutOfServicesCount();
  //   getAvilableServicesCount();
  //   getOnRouteServicesCount();
  // }, []);

  useEffect(() => {
    if (data) {
      const inserviceCount = data.filter((val) => val.status === "in_service");
      setAvilableCount(inserviceCount.length);
      const dockCount = data.filter((val) => val.status === "dock");
      setOutOfServicesCount(dockCount.length);
      const enRouteCount = data.filter((val) => val.status === "en_route");
      setOnRouteCount(enRouteCount.length);
    }
  }, [data]);

  // console.log(outOfServicesCount);
  // console.log(avilableCount);
  // console.log(onRouteCount);

  return (
    <div className="m-5" style={{ width: "450px", height: "250px" }}>
      <Pie
        width={350}
        height={300}
        data={{
          labels: ["Dock", "In Service", "On Route"],
          datasets: [
            {
              label: "# of Votes",
              data: [outOfServicesCount, avilableCount, onRouteCount],
              backgroundColor: [
                "#e05046",
                " #37bc7f",
                " #ffb94d",
                // 'rgba(75, 192, 192, 0.2)',
                // 'rgba(153, 102, 255, 0.2)',
                // 'rgba(255, 159, 64, 0.2)',
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                // 'rgba(75, 192, 192, 1)',
                // 'rgba(153, 102, 255, 1)',
                // 'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
            },
          ],
        }}
        options={{
          responsive: true,
        }}
      />
      <h6 className="mt-3" style={{ color: "#737373", fontWeight: "600" }}>
        Total Fleet Size: {data.length}
      </h6>
    </div>
  );
}

export default ChartPie;
