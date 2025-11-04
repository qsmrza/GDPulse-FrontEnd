import { useState } from "react";

function ApiCall() {

  const makeApiCall = async () => {
    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: "Hello world" }), // replace with your input
      });

      const result = await response.json();
      console.log("API response:", result); // logs the response
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={makeApiCall}>
        Calling API
      </button>
    </div>
  );
}

export default ApiCall;