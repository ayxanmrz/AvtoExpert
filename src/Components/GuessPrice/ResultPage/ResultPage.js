import { useTranslation } from "react-i18next";
import styles from "./ResultPage.module.css";

function ResultPage(props) {
  const [t] = useTranslation("global");

  return (
    <div className={styles.main}>
      <div>
        <div className={styles.topText}>
          <p className={styles.roundResult}>
            {t("price_guesser.round_result")}
          </p>
          <p className={styles.actualPrice}>
            {t("price_guesser.actual_price")} {props.price} &#x20BC;
          </p>
        </div>

        <p className={styles.scoreText}>
          {t("price_guesser.your_guess")}{" "}
          <span className={styles.scoreSpan + " " + props.spanColor}>
            {props.score}
          </span>
        </p>
      </div>

      <button
        onClick={props.isLast ? props.handleRestart : props.handleNext}
        className={styles.nextBtn}
      >
        {props.isLast
          ? t("price_guesser.start_again")
          : t("price_guesser.next_round")}
      </button>
    </div>
  );
}

export default ResultPage;
