import { ResponsiveLine } from "@nivo/line";

const Chart = ({ calculateCurrentValue, stocks, initialBalance, startDate, historicalData, portfolioData }) => {
  const data = Object.entries(historicalData).map(([key, values]) => {
    const reversedDataPoints = [...values].reverse().map((value, index) => ({
      x: index,
      y: value,
    }));
  
    return {
      id: key,
      data: reversedDataPoints,
    };
  });

  const formatStocks = stocks.map((stock) => `${stock.symbol} (${stock.allocation}%)`).join(", ");

  return (
    <div className="h-[450px] w-[700px] my-5 mx-auto block py-3 bg-white rounded-lg">
      <h3>Current Portfolio Value: {' '} 
        {calculateCurrentValue - initialBalance >= 0 ? (
          <span className="text-green-600">
            {"$" +
              calculateCurrentValue +
              " (+%" +
              (
                ((calculateCurrentValue - initialBalance) / initialBalance) *
                100
              ).toFixed(1) +
              ")"}
          </span>
        ) : (
          <span className="text-red-600">
            {"$" +
              calculateCurrentValue +
              " (-%" +
              Math.abs(
                ((calculateCurrentValue - initialBalance) / initialBalance) * 100
              ).toFixed(1) +
              ")"}
          </span>
        )}</h3>
        <p>Initial Balance: ${initialBalance}</p>
        <p>Start Date: {startDate}</p>
        <p>Portfolio: {formatStocks}</p>

        <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 90, bottom: 120, left: 100 }}
        xScale={{ type: "linear" }}
        yyScale={{
          type: "linear",
          min: 0, // Set the minimum value of the y-axis
          max: "auto", // Let the chart automatically determine the maximum value
          stacked: true,
          reverse: false,
        }}
        
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Days from Start Date",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Stock Value",
          legendOffset: -60,
          legendPosition: "middle",
        }}
        
        enablePoints={true}
        pointSize={4}
        pointColor={{ theme: "background" }}
        pointBorderWidth={1}
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
