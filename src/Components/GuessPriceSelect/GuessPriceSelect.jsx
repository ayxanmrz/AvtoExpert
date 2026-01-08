import styles from "./GuessPriceSelect.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { GameModeCard } from "./GameModeCard";
import SinglePlayerIcon from "../../images/PriceGuessIcons/singleplayer.svg?react";
import MultiPlayerIcon from "../../images/PriceGuessIcons/multiplayer.svg?react";

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
        {/* <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Oyun Rejimi</h1>
            <p className={styles.subtitle}>Zəhmət olmasa başlamaq üçün bir rejim seçin</p>
          </div>
          <div className={styles.cards}>
            <div onClick={handleSinglePlayer} className={styles.card}>
              <div className={styles.cardIcon}>
                <SinglePlayerIcon className={styles.icon} />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{t("price_guesser.single_player")}</h3>
                <p className={styles.cardDescription}>Öz biliklərini sınayın və rekord qırın</p>
              </div>
            </div>
            <div onClick={handleMultiPlayer} className={`${styles.card} ${styles.cardMultiplayer}`}>
              <div className={styles.cardIcon}>
                <MultiPlayerIcon className={styles.icon} />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{t("price_guesser.multi_player")}</h3>
                <p className={styles.cardDescription}>Dostlarınızla yarışın və qələbə qazanın</p>
              </div>
              <div className={styles.arrow}>›</div>
            </div>
          </div>
        </div> */}
        <main className="flex-1 flex flex-col justify-center items-center px-6 py-20 w-full max-w-3xl mx-auto">

          {/* Title Section */}
          <div className="text-center mb-10 animate-slide-up">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
              Oyun Rejimi
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium font-poppins!">
              Zəhmət olmasa başlamaq üçün bir rejim seçin
            </p>
          </div>

          {/* Mode Grid */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5 animate-slide-up [animation-delay:100ms]">
            <GameModeCard
              title="Tək Oyunçu"
              description="Öz biliklərinizi sınayın və rekord qırın."
              mode="light"
              icon="person"
              onClick={handleSinglePlayer}
            />

            <GameModeCard
              title="Çox Oyunçu"
              description="Dostlarınızla yarışın və qalib gəlin."
              mode="primary"
              icon="groups"
              onClick={handleMultiPlayer}
            />
          </div>


        </main>
      </div>


    </>
  );
}

export default GuessPriceSelect;
