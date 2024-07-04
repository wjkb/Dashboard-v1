import { ResponsivePie } from "@nivo/pie";
import React, { useEffect, useState } from "react";
import { getAllBots } from "../../api";

const PieChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bots = await getAllBots();
        const activeBots = bots.filter((bot) => bot.active).length;
        const inactiveBots = bots.length - activeBots;

        const chartData = [
          { id: "Active", label: "Active", value: activeBots },
          { id: "Deactivated", label: "Deactivated", value: inactiveBots },
        ];

        // Filter out the data points with a value of 0
        const filteredData = chartData.filter(
          (dataPoint) => dataPoint.value > 0
        );

        setData(filteredData);
      } catch (error) {
        console.error("Error fetching bots data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ height: 400 }}>
      <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors={{ scheme: "nivo" }}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        arcLinkLabelsTextColor="#ffffff"
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default PieChart;
