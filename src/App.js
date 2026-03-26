import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function App() {
  const [stock, setStock] = useState("RELIANCE.BSE");
  const [prices, setPrices] = useState([]);
  const [dates, setDates] = useState([]);
  const [trend, setTrend] = useState("Loading...");

  const API_KEY = "OBQ0OS1KMY1VLDDE";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock}&apikey=${API_KEY}`
        );

        const data = res.data["Time Series (Daily)"];

        let priceArray = [];
        let dateArray = [];

        for (let date in data) {
          priceArray.push(parseFloat(data[date]["4. close"]));
          dateArray.push(date);
        }

        priceArray = priceArray.slice(0, 10).reverse();
        dateArray = dateArray.slice(0, 10).reverse();

        setPrices(priceArray);
        setDates(dateArray);

        // Trend
        if (priceArray[priceArray.length - 1] > priceArray[0]) {
          setTrend("Uptrend 📈");
        } else {
          setTrend("Downtrend 📉");
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [stock]);

  const support = prices.length ? Math.min(...prices) : 0;
  const resistance = prices.length ? Math.max(...prices) : 0;

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: stock,
        data: prices,
        borderColor: "blue",
        fill: false,
      },
    ],
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>📊 Stock Dashboard</h1>

      <select value={stock} onChange={(e) => setStock(e.target.value)}>
        <option value="RELIANCE.BSE">RELIANCE</option>
        <option value="TCS.BSE">TCS</option>
        <option value="INFY.BSE">INFY</option>
      </select>

      <br /><br />

      {prices.length > 0 && <Line data={chartData} />}

      <h3>Trend: {trend}</h3>
      <h3>Support: {support}</h3>
      <h3>Resistance: {resistance}</h3>
    </div>
  );
}

export default App;