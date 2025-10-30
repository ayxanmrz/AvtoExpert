import { useTranslation } from "react-i18next";
import styles from "./LoadingPage.module.css";

function LoadingPage(props) {
  const [t] = useTranslation("global");

  return (
    <div className={styles.loadingPage}>
      {" "}
      <div className={styles.loader}></div>
      <p style={{ fontSize: "20px", fontWeight: 500 }} className="mt-5">
        {props.isLoadingNextRound
          ? t("price_guesser.wait_for_the_next_round")
          : t("price_guesser.loading")}
      </p>
    </div>
  );
}

export default LoadingPage;
