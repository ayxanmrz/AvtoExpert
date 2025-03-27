import "./App.css";
import Header from "./Components/Header/Header";
import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import Reviews from "./Components/Reviews/Reviews";
import Contact from "./Components/Contact/Contact";
import CompareCars from "./Components/CompareCars/CompareCars";
import GuessPrice from "./Components/GuessPrice/GuessPrice";
import GuessPriceSelect from "./Components/GuessPriceSelect/GuessPriceSelect";
import MultiPlayerStart from "./Components/MultiPlayerStart/MultiPlayerStart";
import GamePage from "./Components/GamePage/GamePage";
import { SocketProvider } from "./SocketProvider";

function App() {
  return (
    <div className="body-div">
      <Header />
      <SocketProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/compare" element={<CompareCars />} />
          <Route path="/guess-the-price" element={<GuessPriceSelect />} />
          <Route
            path="/guess-the-price/singleplayer"
            element={<GuessPrice />}
          />
          <Route
            path="/guess-the-price/multiplayer"
            element={<MultiPlayerStart />}
          />
          <Route
            path="/guess-the-price/multiplayer/:lobbyId"
            element={<GamePage />}
          />
        </Routes>
      </SocketProvider>
    </div>
  );
}

export default App;
