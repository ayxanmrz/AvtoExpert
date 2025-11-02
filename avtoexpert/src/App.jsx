import "./App.css";
import Header from "./Components/Header/Header";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import GuessPrice from "./Components/GuessPrice/GuessPrice";
import GuessPriceSelect from "./Components/GuessPriceSelect/GuessPriceSelect";
import MultiPlayerStart from "./Components/MultiPlayerStart/MultiPlayerStart";
import GamePage from "./Components/GamePage/GamePage";
import { SocketProvider } from "./SocketProvider";
import Drawer from "@mui/material/Drawer";
import { useState, useEffect } from "react";
import SideNavigation from "./Components/SideNavigation/SideNavigation";
import { ToastContainer } from "react-toastify";
import { initGA, logPageView } from "./analytics";
import PageNotFound from "./Components/PageNotFound/PageNotFound";

function TrackPageViews() {
  const location = useLocation();

  useEffect(() => {
    logPageView(location.pathname + location.search);
  }, [location]);

  return null;
}

function App() {
  const [openDrawer, setOpenDrawer] = useState(false);
  let navigate = useNavigate();
  const location = useLocation();

  const toggleDrawer = (newOpen) => () => {
    setOpenDrawer(newOpen);
  };

  useEffect(() => {
    initGA();
    if (location.pathname === "/guess") {
      navigate("/");
    }
  }, []);

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
      <TrackPageViews />
      <SocketProvider>
        {/* <div className="body-main-side"> */}
        <Routes>
          {/* <Route path="/" element={<Home isUnderDevelopment />} />
          <Route path="/reviews" element={<Reviews isUnderDevelopment />} />
          <Route path="/contact" element={<Contact isUnderDevelopment />} />
          <Route path="/compare" element={<CompareCars isUnderDevelopment />} /> */}
          <Route path="/" element={<GuessPriceSelect />} index />
          <Route path="/singleplayer" element={<GuessPrice />} />
          <Route path="/multiplayer" element={<MultiPlayerStart />} />
          <Route path="/multiplayer/:lobbyId" element={<GamePage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        {/* </div> */}
        <ToastContainer style={{ fontFamily: "Inter, sans-serif" }} />
      </SocketProvider>
    </div>
  );
}

export default App;
