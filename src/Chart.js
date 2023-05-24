import { ResponsiveLine } from "@nivo/line";

const Chart = (props) => {
  // console.log(props.currentValue);
  // console.log(props.startDate);
  // console.log(props.stocks);
  // console.log(props.historicalData);
  // console.log(props.initialBalance);

  const initialBalance = 260; // float
  const historicalData = [100.0, 300.0, 25.0]; // array
  const currentValue = 300; // float
  const stockValue = [120, 284, 35] // array
  const startDate = "2023-05-22"; // string
  const endDate = "2023-05-23"; // string
  const stocks = ["AAPL", "MSFT", "GME"]; // array

  const data = [];

  for (let i = 0; i < stocks.length; i++) {
    data.push({
      id: stocks[i],
      data: [
        { x: startDate, y: historicalData[i] },
        { x: endDate, y: stockValue[i] },
      ],
    });
  }

  return (
    <div className="h-[500px] w-[700px] my-5 mx-auto block py-5 bg-white rounded-lg">
      <h3>
        Current Portfolio Value: {' '} 
        {currentValue - initialBalance >= 0 ? (
          <span className="text-green-600">
            {"$" +
              currentValue +
              " (+%" +
              (
                ((currentValue - initialBalance) / initialBalance) *
                100
              ).toFixed(1) +
              ")"}
          </span>
        ) : (
          <span className="text-red-600">
            {"$" +
              currentValue +
              " (-%" +
              Math.abs(
                ((currentValue - initialBalance) / initialBalance) * 100
              ).toFixed(1) +
              ")"}
          </span>
        )}
      </h3>
      <ResponsiveLine
        data={data}
        width={700}
        height={500}
        // tooltip={({ point }) => {
        //   return <div>{point.x}</div>;
        // }}
        margin={{ top: 50, right: 90, bottom: 120, left: 100 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Dates",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Share Price",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default Chart;
