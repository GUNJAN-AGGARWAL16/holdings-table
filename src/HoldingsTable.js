import React, { useState, useEffect } from "react";
import axios from "axios";
import { ExpandMore, ExpandLess } from "@material-ui/icons";

function HoldingsTable() {
  const [holdings, setHoldings] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    axios
      .get("https://canopy-frontend-task.now.sh/api/holdings")
      .then((response) => {
        setHoldings(response.data.payload);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const groupByAssetClass = () => {
    const groupedHoldings = {};
    holdings.forEach((holding) => {
      const assetClass = holding.asset_class;
      if (!groupedHoldings[assetClass]) {
        groupedHoldings[assetClass] = [];
      }
      groupedHoldings[assetClass].push(holding);
    });
    return groupedHoldings;
  };

  const toggleGroup = (assetClass) => {
    setExpandedGroups((prevExpandedGroups) => ({
      ...prevExpandedGroups,
      [assetClass]: !prevExpandedGroups[assetClass],
    }));
  };

  const renderGroupedHoldings = () => {
    const groupedHoldings = groupByAssetClass();
    return Object.keys(groupedHoldings).map((assetClass) => (
      <div key={assetClass} style={{ marginBottom: "20px" }}>
        <h2 onClick={() => toggleGroup(assetClass)} style={{ cursor: "pointer" }}>
          {assetClass} ({groupedHoldings[assetClass].length}) - {expandedGroups[assetClass] ? <ExpandLess /> : <ExpandMore />}
        </h2>
        {expandedGroups[assetClass] && (
          <table style={{ width: "100%", borderSpacing: "0 10px" }}>
            <thead>
              <tr>
                <th style={{ padding: "10px 0" }}>Name of the Holding</th>
                <th style={{ padding: "10px 0" }}>Ticker</th>
                <th style={{ padding: "10px 0" }}>Average Price</th>
                <th style={{ padding: "10px 0" }}>Market Price</th>
                <th style={{ padding: "10px 0" }}>Latest Change (%)</th>
                <th style={{ padding: "10px 0" }}>Market Value (Base CCY)</th>
              </tr>
            </thead>
            <tbody>
              {groupedHoldings[assetClass].map((holding) => (
                <tr key={holding.ticker}>
                  <td style={{ padding: "10px 0" }}>{holding.name}</td>
                  <td style={{ padding: "10px 0" }}>{holding.ticker}</td>
                  <td style={{ padding: "10px 0" }}>{holding.avg_price !== undefined ? holding.avg_price : ""}</td>
                  <td style={{ padding: "10px 0" }}>{holding.market_price}</td>
                  <td style={{ padding: "10px 0" }}>{holding.latest_chg_pct}</td>
                  <td style={{ padding: "10px 0" }}>{holding.market_value_ccy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    ));
  };

  return (
    <div>
      <h1>Holdings Table By Gunjan Aggarwal</h1>
      {renderGroupedHoldings()}
    </div>
  );
}

export default HoldingsTable;
