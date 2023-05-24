import React, { useState } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Chart from './Chart.js';
import Modal from './Modal.js'

const Form = () => {
  const [startDate, setStartDate] = useState('')
  const [initialBalance, setInitialBalance] = useState('')
  //const [newBalance, setNewBalance] = useState(0)
  const [stocks, setStocks] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [historicalData, setHistoricalData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isValidInputs()) {
      return
    }

    try {
      setIsLoading(true)
      await fetchHistoricalData()
      setErrorMessage('')
    } catch (error) {
      setErrorMessage('Failed to fetch historical data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const isValidInputs = () => {
    if (!startDate) {
      setErrorMessage('Please enter a valid start date.')
      return false
    }

    if (isNaN(initialBalance) || initialBalance <= 0) {
      setErrorMessage('Please enter a valid initial balance greater than 0.')
      return false
    }

    const totalAllocation = stocks.reduce(
      (total, stock) => total + parseFloat(stock.allocation),
      0
    )
    if (totalAllocation !== 100) {
      setErrorMessage('The total allocation percentage should be 100%.')
      return false
    }
    return true
  }

  const handleStockChange = (index, key, value) => {
    const updatedStocks = [...stocks]
    updatedStocks[index][key] = value

    if (value.length > 5) {
      updatedStocks[index].isInvalid = true
    } else {
      updatedStocks[index].isInvalid = false
    }

    setStocks(updatedStocks)
  }

  const addStock = () => {
    setStocks([...stocks, { symbol: '', allocation: '', num: 0 }])
  }

  const removeStock = (index) => {
    const updatedStocks = [...stocks]
    updatedStocks.splice(index, 1)
    setStocks(updatedStocks)
  }

  const fetchHistoricalData = async () => {
    const apiKey = 'c1c90916f5f94045af23169f5d25efd0'; // Replace with your Twelve Data API key
    const symbols = stocks.map((stock) => stock.symbol);
    const endDate = new Date().toISOString().slice(0, 10);
    
    const response = await axios.get(
      'https://api.twelvedata.com/time_series',
      {
        params: {
          symbol: symbols.join(','),
          interval: '1day',
          start_date: startDate,
          end_date: endDate,
          apikey: apiKey,
        },
      }
    );
      console.log(response.data)
    const historicalData = {};

    for (const symbol in response.data) {
      if (symbol !== 'status' && symbol !== 'meta' && symbol !== 'values') {
        const closeValues = response.data[symbol].values.map(
          (item) => parseFloat(item.close)
        );
        historicalData[symbol] = closeValues;
      }
      else if(symbol === 'values')
      {
        const sym = response.data.meta.symbol;
        const closeValues = response.data.values.map((item) => parseFloat(item.close));
        historicalData[sym] = closeValues;
        console.log(sym, historicalData[sym])
      }
    }

    console.log(historicalData);
    console.log(stocks)
    setHistoricalData(historicalData);
  };
  

  const calculateCurrentValue = () => {
    var total = 0
    for (const key in historicalData) {
      const stockData = historicalData[key];
      const boughtDate = stockData[stockData.length - 1]
      const latestDate = stockData[0]
      const allocation = stocks.find((stock) => stock.symbol === key)?.allocation;
      const stockValue = latestDate * (allocation / 100) * initialBalance / boughtDate;

      total += stockValue
    }
  
    return total.toFixed(2);
  };

  const handleClear = () => {
    window.location.reload();
  };
  
  // setHistoricalData("Test")
  //   axios.post('http://127.0.0.1:5000/get_stocks', { stocks: stocks, startDate: startDate, endDate: new Date().toISOString().slice(0, 10), balance: initialBalance })
  //   .then(response => {
  //     console.log(response)
  //     if(response.data.value)
  //       setNewBalance(response.data.value)
  //     else
  //       setNewBalance(response.data)
  //   })

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-6 mt-20 bg-white shadow-lg rounded-lg">
        <label className="block mb-4">
          <span className="text-gray-700">Start Date:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Initial Balance:</span>
          <input
            type="number"
            value={initialBalance}
            onChange={(e) => setInitialBalance(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
          />
        </label>

        {stocks.map((stock, index) => (
          <div key={index} className="mb-4">
            <label className="block mb-2">
              <span className="text-gray-700">Stock Symbol:</span>
              <div className="relative mt-1 rounded-md shadow-sm">
                <input
                  type="text"
                  value={stock.symbol}
                  onChange={(e) =>
                    handleStockChange(index, 'symbol', e.target.value)
                  }
                  required
                  className={`block w-full pr-10 border-gray-300 rounded-md focus:border-blue-300 focus:ring ${
                    stock.isInvalid ? 'border-red-500' : ''
                  }`}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span
                    className={`text-sm ${
                      stock.isInvalid ? 'text-red-500' : 'text-gray-500'
                    }`}>
                    {stock.symbol.length}/5
                  </span>
                </div>
              </div>
            </label>

            {stock.isInvalid && (
              <p className="text-red-500 text-sm mt-1">
                Stock symbol exceeds the maximum character limit of 5.
              </p>
            )}

            <label className="block mb-2">
              <span className="text-gray-700">Allocation (%):</span>
              <input
                type="number"
                value={stock.allocation}
                onChange={(e) =>
                  handleStockChange(index, 'allocation', e.target.value)
                }
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              />
            </label>

            {index > 0 && (
              <button
                type="button"
                onClick={() => removeStock(index)}
                className="text-red-500 hover:text-red-700 focus:outline-none">
                Remove Stock
              </button>
            )}
          </div>
        ))}

        <br></br>

        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 mb-4 mr-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
        >
           Reset Data 
        </button>
            
        <button
          type="button"
          onClick={addStock}
          className="mb-4 mr-4 text-blue-500 hover:text-blue-700 focus:outline-none">
          Add Stock
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          onClick={() => setIsOpen(true)}>
          Calculate
        </button>
        <Modal open={isOpen} onClose={()=>setIsOpen(false)}>
          <Chart 
            startDate={startDate}
            stocks={stocks}
            historicalData={historicalData}
            initialBalance={initialBalance}
            currentValue={newBalance}
          />
        </Modal>



        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            {Object.keys(historicalData).length > 0 && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Results</h2>
                <p>Start Date: {startDate}</p>
                <p>Initial Balance: ${initialBalance}</p>
                <p>Portfolio Allocation:</p>
                <ul>
                  {stocks.map((stock, index) => (
                    <li key={index}>
                      {stock.symbol}: {stock.allocation}%
                    </li>
                  ))}
                </ul>
                <p>Current Portfolio Value: ${calculateCurrentValue()}</p>
              </div>
            )}
          </>
        )}

        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      </form>
    </div>
  )
}

export default Form
