import { useEffect } from "react";
import Finder from "../Finder/Finder";
import UnderDevelopment from "../UnderDevelopment/UnderDevelopment";
import { useTranslation } from "react-i18next";

function Home(props) {
  const [t] = useTranslation("global");
  useEffect(() => {
    document.title = t("header.home") + " | AvtoExpert";
  }, [t]);
  return <>{props.isUnderDevelopment ? <UnderDevelopment /> : <Finder />}</>;
}

export default Home;
