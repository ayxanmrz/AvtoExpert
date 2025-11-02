import styles from "./GuessPriceSelect.module.css";
import { useTranslation } from "react-i18next";
import SinglePlayerIcon from "../../images/PriceGuessIcons/singleplayer.svg?react";
import MultiPlayerIcon from "../../images/PriceGuessIcons/multiplayer.svg?react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function GuessPriceSelect() {
  const [t] = useTranslation("global");
  let navigate = useNavigate();

  useEffect(() => {
    document.title = t("header.home") + " | AvtoExpert";
  }, [t]);

  const handleSinglePlayer = () => {
    navigate("/singleplayer");
  };
  const handleMultiPlayer = () => {
    navigate("/multiplayer");
  };

  return (
    <>
      <>
        <title>{t("header.home")} | AvtoExpert</title>
        <meta
          name="description"
          content="AvtoExpert – avtomobil həvəskarları üçün əyləncəli oyun! Qiymətləri bil, dostlarınla yarış və avtomobil biliklərini nümayiş etdir. 🚗💨"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="AvtoExpert – Avtomobil həvəskarları üçün oyun 🚗💨" />
        <meta property="og:url" content="https://avtoexpert.az/" />

      </>
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
    </>
  );
}

export default GuessPriceSelect;
