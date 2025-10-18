import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-6P47M1CXJC"); // replace with your Measurement ID
};

export const logPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};
