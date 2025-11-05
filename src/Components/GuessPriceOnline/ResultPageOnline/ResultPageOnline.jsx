import { useTranslation } from "react-i18next";
import styles from "./ResultPageOnline.module.css";

function ResultPageOnline(props) {
  const [t] = useTranslation("global");

  const getSpanColor = (score) => {
    if (score > 850) {
      return styles.greenSpan;
    } else if (score > 500) {
      return styles.yellowSpan;
    } else {
      return styles.redSpan;
    }
  };

  const getScoreBackground = (index) => {
    if (index === 0) {
      return styles.firstPlace;
    } else if (index === 1) {
      return styles.secondPlace;
    } else if (index === 2) {
      return styles.thirdPlace;
    } else {
      return styles.normalBackground;
    }
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

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

        <div className={styles.resultsSideContainer}>
          <div className={styles.resultDivs}>
            {props.lastScores
              .sort((a, b) => b.score - a.score)
              .map((result, index) => (
                <div
                  key={index}
                  className={`${styles.resultDiv} ${getScoreBackground(index)} ${result.socketId === props.socketId ? styles.yourResult : ""
                    }`}
                >
                  <span className={styles.resultTitle}>{result.username}</span>
                  <div className={styles.pointsDiv}>
                    <span className={styles.priceResultText}>
                      &#x20BC; {numberWithCommas(result.priceGuess)}
                    </span>
                    <span className={styles.scoreHolderSpan}>
                      <span
                        className={
                          styles.scoreSpan + " " + getSpanColor(result.score)
                        }
                      >
                        {result.score}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
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
