import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [ngrams, setNgrams] = useState({});
  const [ngramSize, setNgramSize] = useState(2);

  const handleSubmit = async () => {
    try {

      const response = await axios.post(`http://localhost:8000/ngrams?n=${ngramSize}`, {
        text,
      });
      setNgrams(response.data);
    } catch (error) {
      if (error.response?.status === 400) {
        alert(error.response.data.error);
      } else {
        console.error("Unexpected error. Status code:", error.response?.status)
      }
    }
  };

  // process response data to be used for histogram
  const chartData = Object.entries(ngrams).map(([ngram, count]) => ({
    ngram,
    count,
  }));

  return (
    <div>
      <label>
        N-gram size:
        <select value={ngramSize} onChange={(e) => setNgramSize(Number(e.target.value))}>
          {[1, 2, 3, 4, 5].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </label>
      <h1>Ngram Histogram</h1>
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
              dataKey="ngram"
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
