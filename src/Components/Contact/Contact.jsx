import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import UnderDevelopment from "../UnderDevelopment/UnderDevelopment";

function Contact(props) {
  const [t] = useTranslation("global");
  useEffect(() => {
    document.title = t("header.contact") + " | AvtoExpert";
  }, [t]);
  return <>{props.isUnderDevelopment && <UnderDevelopment />}</>;
}

export default Contact;
