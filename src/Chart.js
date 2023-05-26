import { ResponsiveLineCanvas } from "@nivo/line";

const Chart = (props) => {
  // console.log(props.currentValue);
  // console.log("stockprice", props.stockPriceDates); // object
  // console.log("stocks", props.stocks); // array of objects
  // console.log("historical data", props.historicalData); // object
  // console.log(props.initialBalance); // int

  // const initialBalance = 260; // float
  // const historicalData = [100.0, 300.0, 25.0]; // array
  // const currentValue = 300; // float
  // const stockValue = [120, 284, 35] // array
  // const startDate = "2023-05-22"; // string
  // const endDate = "2023-05-23"; // string
  // const stocks = ["AAPL", "MSFT", "GME"]; // array

  const final_data = [];

  // console.log("stock price", props.stockPriceDates[props.stocks[0].symbol].reverse())
  // console.log("stockPriceDates lenght: ", Object.keys(props.stockPriceDates).length)

  while (
    (Object.keys(props.stockPriceDates).length === 0) |
    (props.stocks.length === 0) |
    (props.historicalData.length === 0) |
    (props.initialBalance === "")
  ) {
    return <p>Loading...</p>;
  }

  for (let i = 0; i < props.stocks.length; i++) {
    let id = props.stocks[i].symbol;
    let data = [];
    for (
      let j = 0;
      j < props.stockPriceDates[Object.keys(props.stockPriceDates)[0]].length;
      j++
    ) {
      data.push({
        x: props.stockPriceDates[props.stocks[i].symbol][j],
        y: props.historicalData[props.stocks[i].symbol][j],
      });
    }
    final_data.push({
      id: id,
      data: data,
    });
  }
  // for every stock provided by the user

  // console.log(final_data)
  for (let i = 0; i < final_data.length; i++) {
    final_data[i].data.reverse();
  }
  // console.log(final_data)

  return (
    <div className=" w-[800px] my-5 mx-auto block py-1 bg-white rounded-lg">
      {Object.keys(props.historicalData).length > 0 && (
        <div className="mt-1">
          <h2 className="text-3xl font-semibold mb-2 text-center">Results</h2>
          <h1 className="text-center">
            Current Portfolio Value:{" "}
            <span>
              {props.calculateCurrentValue - props.initialBalance >= 0 ? (
                <span className="text-green-600">
                  {"$" +
                    props.calculateCurrentValue +
                    " (+%" +
                    (
                      ((props.calculateCurrentValue - props.initialBalance) /
                        props.initialBalance) *
                      100
                    ).toFixed(1) +
                    ")"}
                </span>
              ) : (
                <span className="text-red-600">
                  {"$" +
                    props.calculateCurrentValue +
                    " (-%" +
                    Math.abs(
                      ((props.calculateCurrentValue - props.initialBalance) /
                        props.initialBalance) *
                        100
                    ).toFixed(1) +
                    ")"}
                </span>
              )}
            </span>
          </h1>
          <div className="flex my-5">
            <div className="flex-1 text-center ">
              <p>Start Date: {props.startDate}</p>
              <p>Initial Balance: ${props.initialBalance}</p>
            </div>
            <div className="flex-1 text-center">
              <p>Portfolio Allocation:</p>
              <ul>
                {props.stocks.map((stock, index) => (
                  <li key={index}>
                    {stock.symbol}: {stock.allocation}%
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      <div className="h-[500px]">
      <ResponsiveLineCanvas
        data={final_data}
        width={800}
        height={500}
        // tooltip={({ point }) => {
        //   return <div>{point.x}</div>;
        // }}
        margin={{ top: 50, right: 90, bottom: 120, left: 100 }}
        xScale={{ type: "time", format: "%Y-%m-%d" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        xFormat="time:%Y-%m-%d"
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        // theme={{"background": "#FFFFFF"}}
        axisBottom={{
          format: "%b %d",
          tickValues: 6,
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
          legend: "Share Price (USD)",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        pointSize={4}
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
    </div>
  );
};

export default Chart;
