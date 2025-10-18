import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-6P47M1CXJC");
};

export const logPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};
