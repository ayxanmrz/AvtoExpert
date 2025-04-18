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
import Drawer from "@mui/material/Drawer";
import { useState, useEffect } from "react";
import SideNavigation from "./Components/SideNavigation/SideNavigation";
import zIndex from "@mui/material/styles/zIndex";

function App() {
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpenDrawer(newOpen);
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 625 && openDrawer) {
        setOpenDrawer(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [openDrawer]);

  return (
    <div className="body-div">
      <Header handleOpenDrawer={toggleDrawer(true)} />
      <Drawer
        sx={{
          // zIndex: 99999,
          "& .MuiList-root": {
            zIndex: 9999999,
          },
        }}
        anchor="right"
        open={openDrawer}
        onClose={toggleDrawer(false)}
      >
        <SideNavigation closeDrawer={toggleDrawer(false)} />
      </Drawer>
      <SocketProvider>
        {/* <div className="body-main-side"> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/compare" element={<CompareCars />} />
          <Route path="/guess" element={<GuessPriceSelect />} />
          <Route path="/guess/singleplayer" element={<GuessPrice />} />
          <Route path="/guess/multiplayer" element={<MultiPlayerStart />} />
          <Route path="/guess/multiplayer/:lobbyId" element={<GamePage />} />
        </Routes>
        {/* </div> */}
      </SocketProvider>
    </div>
  );
}

export default App;
