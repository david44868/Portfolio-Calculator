import React, { useState } from 'react'
import axios from 'axios'

const Form = () => {
  const [startDate, setStartDate] = useState('')
  const [initialBalance, setInitialBalance] = useState('')
  const [stocks, setStocks] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [historicalData, setHistoricalData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

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
    setStocks([...stocks, { symbol: '', allocation: '' }])
  }

  const removeStock = (index) => {
    const updatedStocks = [...stocks]
    updatedStocks.splice(index, 1)
    setStocks(updatedStocks)
  }

  const fetchHistoricalData = async () => {
    const apiKey = '2687b93371259937786048b11fdd5c3f'
    const symbols = stocks.map((stock) => stock.symbol)
    const endDate = new Date().toISOString().slice(0, 10)

    const response = await axios.get('http://api.marketstack.com/v1/eod', {
      params: {
        access_key: apiKey,
        symbols: symbols.join(','),
        date_from: startDate,
        date_to: endDate,
      },
    })

    const { data } = response.data
    console.log(response.data)
    setHistoricalData(data)
  }

  const calculateCurrentValue = () => {
    const totalValue = historicalData.reduce((total, item) => {
      const matchingStock = stocks.find((stock) => stock.symbol === item.symbol)
      const allocation = matchingStock
        ? parseFloat(matchingStock.allocation)
        : 0
      const stockValue =
        (allocation / 100) * initialBalance * (item.close / item.open)
      return total + stockValue
    }, 0)
    return totalValue.toFixed(2)
  }

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

        <button
          type="button"
          onClick={addStock}
          className="mb-4 mr-4 text-blue-500 hover:text-blue-700 focus:outline-none">
          Add Stock
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none">
          Calculate
        </button>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            {historicalData.length > 0 && (
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
