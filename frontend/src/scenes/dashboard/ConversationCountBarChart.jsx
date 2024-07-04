import { ResponsiveBar } from "@nivo/bar";
import React, { useEffect, useState } from "react";
import { tokens } from "../../theme";
import { getConversationCount } from "../../graphApi";

const ConversationCountBarChart = () => {
  const colors = tokens;
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const conversationCount = await getConversationCount();

        const chartData = Object.keys(conversationCount).map((platform) => ({
          platform,
          count: conversationCount[platform],
        }));

        setData(chartData);
      } catch (error) {
        console.error("Error fetching conversation count data:", error);
      }
    };

    fetchData();
  }, []);

  const platformColors = {
    facebook: "#1b74e4",
    whatsapp: "#25D366",
    telegram: "#0088cc",
  };

  const theme = {
    axis: {
      legend: {
        text: {
          fill: colors.greenAccent, // White color for axis labels
        },
      },
      ticks: {
        text: {
          fill: "#ffffff", // White color for axis ticks
        },
      },
    },
  };

  return (
    <div style={{ height: 400 }}>
      <ResponsiveBar
        data={data}
        keys={["count"]}
        indexBy="platform"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={({ id, data }) => platformColors[data.platform]}
        borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Platform",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          format: (e) => (Number.isInteger(e) ? e : ""),
          legend: "Count",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        theme={theme}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </div>
  );
};

export default ConversationCountBarChart;
