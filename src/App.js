import "./App.css";
import Header from "./Components/Header/Header";
import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import Reviews from "./Components/Reviews/Reviews";
import Contact from "./Components/Contact/Contact";
import CompareCars from "./Components/CompareCars/CompareCars";
import GuessPrice from "./Components/GuessPrice/GuessPrice";

function App() {
  return (
    <div className="body-div">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/compare" element={<CompareCars />} />
        <Route path="/guess-the-price" element={<GuessPrice />} />
      </Routes>
    </div>
  );
}

export default App;
