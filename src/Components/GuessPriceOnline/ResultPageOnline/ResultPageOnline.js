import { useTranslation } from "react-i18next";
import styles from "./ResultPageOnline.module.css";

function ResultPageOnline(props) {
  const [t, i18n] = useTranslation("global");

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
        // onClick={props.isLast ? props.handleRestart : props.handleNext}
        className={styles.nextBtn}
        disabled
      >
        {props.isLast
          ? t("price_guesser.match_finished")
          : t("price_guesser.wait_for_the_next_round")}
      </button>
    </div>
  );
}

export default ResultPageOnline;
