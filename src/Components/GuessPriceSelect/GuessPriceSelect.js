import styles from "./GuessPriceSelect.module.css";
import { useTranslation } from "react-i18next";
import { ReactComponent as SinglePlayerIcon } from "../../images/PriceGuessIcons/singleplayer.svg";
import { ReactComponent as MultiPlayerIcon } from "../../images/PriceGuessIcons/multiplayer.svg";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function GuessPriceSelect() {
  const [t, i18n] = useTranslation("global");
  let navigate = useNavigate();

  useEffect(() => {
    document.title = t("header.price_guesser") + " | AvtoExpert";
  }, [t]);

  const handleSinglePlayer = () => {
    navigate("/guess/singleplayer");
  };
  const handleMultiPlayer = () => {
    navigate("/guess/multiplayer");
  };

  return (
    <div className={styles.main}>
      <div className={styles.buttons}>
        <button onClick={handleSinglePlayer} className={styles.button}>
          <div className={styles.buttonInnerDiv}>
            <SinglePlayerIcon fill="#fff"></SinglePlayerIcon>
            <span>{t("price_guesser.single_player")}</span>
          </div>
        </button>
        <button onClick={handleMultiPlayer} className={styles.button}>
          <div className={styles.buttonInnerDiv}>
            <MultiPlayerIcon fill="#fff"></MultiPlayerIcon>
            {t("price_guesser.multi_player")}
          </div>
        </button>
      </div>
    </div>
  );
}

export default GuessPriceSelect;
