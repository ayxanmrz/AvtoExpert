import { useTranslation } from "react-i18next";
import styles from "./GuessPriceOnline.module.css";
import CalendarSvg from "../../images/PriceGuessIcons/calendar.svg?react";
import CarSvg from "../../images/PriceGuessIcons/car.svg?react";
import EngineSvg from "../../images/PriceGuessIcons/engine.svg?react";
import OdometerSvg from "../../images/PriceGuessIcons/odometer.svg?react";
import RightArrow from "../../images/PriceGuessIcons/right.svg?react";
import LeftArrow from "../../images/PriceGuessIcons/left.svg?react";
import TransmissionSvg from "../../images/PriceGuessIcons/transmission.svg?react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import ResultPageOnline from "./ResultPageOnline/ResultPageOnline";
import LinearProgress from "@mui/material/LinearProgress";

function GuessPriceOnline(props) {
  const [t] = useTranslation("global");

  function numberWithCommas(x) {
    if (!x && x !== 0) return "";
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const engineTranslation = (engine) => {
    let engineList = engine.split(" / ");
    engineList[engineList.length - 1] = t(
      "price_guesser.fuel_types." +
      engineList[engineList.length - 1].toLowerCase().replaceAll(" ", "-")
    );
    return engineList.join(" / ");
  };

  const calculateScore = (actual, guess) => {
    let errorRatio = Math.abs(guess - actual) / actual;
    return Math.max(0, Math.round(1000 * (1 - errorRatio)));
  };

  const submitCar = () => {
    if (props.priceGuess !== 0 && props.priceGuess > 0) {
      props.handleSubmitCar(props.priceGuess);
    }
  };

  const getSpanColor = (score) => {
    if (score > 850) {
      return styles.greenSpan;
    } else if (score > 500) {
      return styles.yellowSpan;
    } else {
      return styles.redSpan;
    }
  };

  const hanlePlusMinusButtons = (amount) => {
    if (!props.isSubmitted) {
      if (amount > 0) {
        props.setPriceGuess((prev) =>
          prev + amount > 10_000_000 ? 10_000_000 : prev + amount
        );
      } else {
        props.setPriceGuess((prev) => (prev + amount >= 0 ? prev + amount : 0));
      }
    }
  };

  const handlePriceGuessChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value > 10_000_000) {
      props.setPriceGuess(10_000_000);
    } else {
      props.setPriceGuess(value ? Number(value) : "");
    }
  };

  return (
    <div className={styles.container}>
      {props.currentCar && (
        <>
          {" "}
          <div className={styles.gameContainer}>
            <div className={styles.mainSide}>
              <span className={styles.roundCounter}>
                {t("price_guesser.round")} {props.currentRoundNumber} /{" "}
                {props.totalNumberOfCars}
              </span>
              {props.showResult && (
                <ResultPageOnline
                  score={props.lastScore}
                  isLast={props.isLast}
                  price={numberWithCommas(props.lastPrice)}
                  spanColor={getSpanColor(
                    calculateScore(props.lastPrice, props.priceGuess)
                  )}
                  lastScores={props.lastScores}
                  socketId={props.socketId}
                />
              )}
              <div
                style={{ display: props.showResult ? "none" : "block" }}
                className={styles.mainSideContainer}
              >
                <div className={styles.topSide}>
                  <div className={styles.imageSlider}>
                    <button
                      onClick={() => {
                        props.setCurrentImageIndex((prev) =>
                          prev - 1 < 0
                            ? props.currentCar.images.length - 1
                            : prev - 1
                        );
                      }}
                      className={styles.sliderButtons}
                    >
                      <LeftArrow stroke="white"></LeftArrow>
                    </button>
                    <img
                      src={props.currentCar?.images[props.currentImageIndex]}
                      alt="Car"
                    ></img>
                    <button
                      className={styles.sliderButtons}
                      onClick={() => {
                        props.setCurrentImageIndex(
                          (prev) => (prev + 1) % props.currentCar.images.length
                        );
                      }}
                    >
                      <RightArrow stroke="white"></RightArrow>
                    </button>
                  </div>
                  <div className={styles.infoBoxes}>
                    <div className={styles.infoBox}>
                      <CarSvg stroke="#f6a80b" />
                      {props.currentCar.title}
                    </div>
                    <div className={styles.infoBox}>
                      <CalendarSvg fill="#f6a80b" stroke="#f6a80b" />
                      {props.currentCar.year}
                    </div>
                    <div className={styles.infoBox}>
                      <OdometerSvg stroke="#f6a80b" fill="#f6a80b" />
                      {props.currentCar.mileage}
                    </div>
                    <div className={styles.infoBox}>
                      <EngineSvg stroke="#f6a80b" />
                      {engineTranslation(
                        props.currentCar.engine.replace(
                          "a.g.",
                          t("price_guesser.horse_power")
                        )
                      )}
                    </div>
                    <div className={styles.infoBox}>
                      <TransmissionSvg fill="#f6a80b" stroke="#f6a80b" />
                      {t(
                        "price_guesser.transmission_types." +
                        props.currentCar.transmission.toLowerCase()
                      ) || props.currentCar.transmission}
                    </div>
                  </div>
                </div>
                <div className={styles.bottomSide}>
                  <LinearProgress
                    sx={{
                      backgroundColor: "#fbdb94",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#f6a80b",
                        transition: "0.1s linear",
                      },
                    }}
                    variant="determinate"
                    value={props.timer}
                  />
                  <div className={styles.priceInputSide}>
                    <div className={styles.priceInputSideContainer}>
                      <div className={styles.priceInputDiv}>
                        <span className={styles.manatSymbol}>&#x20BC;</span>
                        <input
                          value={numberWithCommas(props.priceGuess)}
                          inputMode="numeric"
                          min={0}
                          onChange={handlePriceGuessChange}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              submitCar();
                            }
                          }}
                          className={styles.priceInput}
                          disabled={props.isSubmitted}
                        />
                        <button
                          disabled={props.priceGuess === 0 || props.isSubmitted}
                          className={styles.priceSubmitButton}
                          onClick={submitCar}
                        >
                          <ArrowForwardIcon
                            style={{ width: "24px" }}
                          ></ArrowForwardIcon>
                        </button>
                      </div>
                      <div className={styles.priceButtons}>
                        <button
                          disabled={props.isSubmitted}
                          onClick={() => {
                            hanlePlusMinusButtons(1000);
                          }}
                          className={`${styles.priceButton} ${styles.plusButton}`}
                        >
                          + 1.000 &#x20BC;
                        </button>
                        <button
                          disabled={props.isSubmitted}
                          onClick={() => {
                            hanlePlusMinusButtons(2500);
                          }}
                          className={`${styles.priceButton} ${styles.plusButton}`}
                        >
                          + 2.500 &#x20BC;
                        </button>
                        <button
                          disabled={props.isSubmitted}
                          onClick={() => {
                            hanlePlusMinusButtons(5000);
                          }}
                          className={`${styles.priceButton} ${styles.plusButton}`}
                        >
                          + 5.000 &#x20BC;
                        </button>
                        <button
                          disabled={props.isSubmitted}
                          onClick={() => {
                            hanlePlusMinusButtons(-1000);
                          }}
                          className={`${styles.priceButton} ${styles.minusButton}`}
                        >
                          - 1.000 &#x20BC;
                        </button>
                        <button
                          disabled={props.isSubmitted}
                          onClick={() => {
                            hanlePlusMinusButtons(-2500);
                          }}
                          className={`${styles.priceButton} ${styles.minusButton}`}
                        >
                          - 2.500 &#x20BC;
                        </button>
                        <button
                          disabled={props.isSubmitted}
                          onClick={() => {
                            hanlePlusMinusButtons(-5000);
                          }}
                          className={`${styles.priceButton} ${styles.minusButton}`}
                        >
                          - 5.000 &#x20BC;
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.resultsSide}>
              <div className={styles.resultsSideContainer}>
                <div className={styles.resultsTop}>
                  <SportsScoreIcon style={{ color: "#f6a80b" }} />
                  {t("price_guesser.results")}
                  <span className={styles.scoreSpan}>
                    {props.results.length}
                  </span>
                </div>
                <div className={styles.resultDivs}>
                  {props.results
                    .sort((a, b) => b.score - a.score)
                    .map((result, index) => (
                      <div key={index} className={styles.resultDiv}>
                        <span className={styles.resultTitle}>
                          <span>{index + 1}.</span> {result.username}
                          {result.socketId === props.socketId && (
                            <span
                              style={{ fontStyle: "italic", color: "gray" }}
                            >
                              {" "}
                              ({t("price_guesser.you")})
                            </span>
                          )}
                        </span>
                        <span
                          className={
                            styles.scoreSpan + " " + getSpanColor(result.score)
                          }
                        >
                          {result.score}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default GuessPriceOnline;
