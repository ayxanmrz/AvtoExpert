import styles from "./UnderDevelopment.module.css";
import Illustration from "../../images/UnderDevelopment.png";
import { useTranslation } from "react-i18next";

function UnderDevelopment() {
  const [t, i18n] = useTranslation("global");

  return (
    <div className={styles.main}>
      <img src={Illustration}></img>
      <p>{t("errors.under_development")}</p>
    </div>
  );
}

export default UnderDevelopment;
