import UnderDevelopment from "../UnderDevelopment/UnderDevelopment";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

function Reviews(props) {
  const [t] = useTranslation("global");
  useEffect(() => {
    document.title = t("header.reviews") + " | AvtoExpert";
  }, [t]);
  return <>{props.isUnderDevelopment && <UnderDevelopment />}</>;
}

export default Reviews;
