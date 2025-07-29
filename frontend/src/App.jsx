import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [bigrams, setBigrams] = useState({});

  const handleSubmit = async () => {
    try {
      console.log("sending request");
      const response = await axios.post("http://localhost:8000/bigrams", {
        text,
      });
      setBigrams(response.data);
    } catch (error) {
      console.error("Error fetching bigrams:", error);
    }
  };

  // process response data to be used for histogram
  const chartData = Object.entries(bigrams).map(([bigram, count]) => ({
    bigram,
    count,
  }));

  return (
    <div>
      <h1>Bigram Histogram</h1>
      <textarea
        rows={10}
        cols={50}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text here..."
      />
      <br />
      <button onClick={handleSubmit}>Generate Histogram</button>

      {chartData.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="bigram"
              angle={-45}
              textAnchor="end"
              interval={0}
              height={100}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
export default App;
