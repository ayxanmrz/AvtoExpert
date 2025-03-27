import { useTranslation } from "react-i18next";
import styles from "./LoadingPage.module.css";

function LoadingPage() {
  const [t, i18n] = useTranslation("global");

  return (
    <div className={styles.loadingPage}>
      {" "}
      <div className={styles.loader}></div>
      <p style={{ fontSize: "20px", fontWeight: 500 }}>
        {t("price_guesser.loading")}
      </p>
    </div>
  );
}

export default LoadingPage;
