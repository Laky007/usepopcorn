import { useState } from "react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import StarRating from "./StarRating.jsx";

// function Test() {
//   const [rateGiven, setRateGiven] = useState(0);

//   return (
//     <>
//       <StarRating color="blue" maxRating={10} setOtherState={setRateGiven} />
//       <p>This is a {rateGiven} stars movie</p>
//     </>
//   );
// }

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    {/* <StarRating
      maxRating={5}
      size={96}
      color="red"
      messages={["Terrible", "Bad", "Ok", "Great", "Awesome"]}
      defaultRating={3}
    />

    <StarRating />

    <Test /> */}
  </React.StrictMode>
);
