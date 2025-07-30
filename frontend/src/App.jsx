import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [ngrams, setNgrams] = useState({});
  const [ngramSize, setNgramSize] = useState(2);
  const [showAll, setShowAll] = useState(false);
  const [mostFrequentK, setMostFrequentK] = useState(20);
  const [minFrequency, setMinFrequency] = useState(1);

  const handleSubmit = async () => {
    try {
      const queryParams = new URLSearchParams({
        min_frequency: minFrequency,
      });

      if (!showAll) {
        queryParams.append("k_most_frequent", mostFrequentK);
      }

      const response = await axios.post(`http://localhost:8000/ngrams?${queryParams.toString()}`, {text, ngram_size: ngramSize});
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
  const chartData = Object.entries(ngrams).map(([ngram, count]) => ({ngram, count,}));
  const chartWidth = Math.max(chartData.length * 50, 1300);

  return (
    <div>
      <h1>Ngram Histogram</h1>
      <textarea
        rows={10}
        cols={50}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text here..."
      />
      <br />
      <label>
        N-gram size:
        <select value={ngramSize} onChange={(e) => setNgramSize(Number(e.target.value))}>
          {[2, 3, 4, 5].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </label>

      <div>
        <button onClick={handleSubmit}>Generate Histogram</button>
      </div>


      <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "1rem" }}>
        <label>
          <input
            type="checkbox"
            checked={showAll}
            onChange={(e) => setShowAll(e.target.checked)}
          />
          Show all
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          Show top K:
          <input
            type="number"
            value={mostFrequentK}
            min={1}
            disabled={showAll}
            onChange={(e) => setMostFrequentK(Number(e.target.value))}
          />
        </label>

        <label>
          Min frequency:
          <input
            type="number"
            min={1}
            value={minFrequency}
            onChange={(e) => setMinFrequency(Number(e.target.value))}
          />
        </label>


      </div>


      <div style={{ overflowX: "auto", width: "100%" }}>
        <div style={{ width: `${chartWidth}px` }}>
          <BarChart
            data={chartData}
            width={chartWidth}
            height={400}
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
        </div>
      </div>

    </div>
  );
}

export default App;
