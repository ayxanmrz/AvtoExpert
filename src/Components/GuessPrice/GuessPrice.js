import { useTranslation } from "react-i18next";
import styles from "./GuessPrice.module.css";
import { useState, useEffect, use } from "react";
import { ReactComponent as CalendarSvg } from "../../images/PriceGuessIcons/calendar.svg";
import { ReactComponent as CarSvg } from "../../images/PriceGuessIcons/car.svg";
import { ReactComponent as EngineSvg } from "../../images/PriceGuessIcons/engine.svg";
import { ReactComponent as OdometerSvg } from "../../images/PriceGuessIcons/odometer.svg";
import { ReactComponent as RightArrow } from "../../images/PriceGuessIcons/right.svg";
import { ReactComponent as LeftArrow } from "../../images/PriceGuessIcons/left.svg";
import { ReactComponent as TransmissionSvg } from "../../images/PriceGuessIcons/transmission.svg";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import ResultPage from "./ResultPage/ResultPage";
import badSound from "../../sounds/bad.mp3";
import normalSound from "../../sounds/normal.mp3";
import goodSound from "../../sounds/good.mp3";
import LoadingPage from "../LoadingPage/LoadingPage";

function GuessPrice() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [t, i18n] = useTranslation("global");

  const [showResults, setShowResults] = useState(false);

  const [priceGuess, setPriceGuess] = useState(0);
  const API_URL = process.env.REACT_APP_SERVER_API;

  const [results, setResults] = useState([]);

  const play = (sound) => {
    new Audio(sound).play();
  };

  const fetchCars = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setCars(data.cars);
      setCurrentIndex(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    if (e.key == "Enter") {
      submitCar();
      return;
    }
    const allowedKeys = [37, 39, 8];
    if (allowedKeys.includes(e.keyCode)) {
      return;
    }
    if (e.keyCode === 189 || e.keyCode === 69 || e.key.isNaN) {
      e.preventDefault();
    }

    if (e.type === "paste") {
      key = e.clipboardData.getData("text/plain");
    } else {
      var key = e.keyCode || e.which;
      key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
      e.returnValue = false;
      if (e.preventDefault) e.preventDefault();
    }
  };

  function numberWithCommas(x) {
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
    if (priceGuess !== 0 && priceGuess > 0) {
      setShowResults(true);
      playSoundAccScore(calculateScore(cars[currentIndex].price, priceGuess));
      setResults((prev) => [
        {
          title: cars[currentIndex].title,
          score: calculateScore(cars[currentIndex].price, priceGuess),
        },
        ...prev,
      ]);
    }
  };

  const handleRestart = () => {
    setShowResults(false);
    setResults([]);
    fetchCars();
    setPriceGuess(0);
    setCurrentImageIndex(0);
  };

  const nextCar = () => {
    setShowResults(false);
    setCurrentImageIndex(0);
    setCurrentIndex((prev) => prev + 1);
    setPriceGuess(0);
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

  const playSoundAccScore = (score) => {
    if (score > 850) {
      return play(goodSound);
    } else if (score > 500) {
      return play(normalSound);
    } else {
      return play(badSound);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div className={styles.container}>
      {loading && <LoadingPage />}
      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {" "}
          <p style={{ color: "red", margin: 0 }}>❌ {error}</p>{" "}
          <button className={styles.btn} onClick={fetchCars} disabled={loading}>
            {loading ? "Loading..." : "🔄 " + t("price_guesser.refresh")}
          </button>
        </div>
      )}

      {(cars.length && !loading) > 0 && (
        <>
          {" "}
          <div className={styles.gameContainer}>
            <div className={styles.mainSide}>
              {showResults && (
                <ResultPage
                  score={calculateScore(cars[currentIndex].price, priceGuess)}
                  isLast={currentIndex === cars.length - 1}
                  price={numberWithCommas(cars[currentIndex].price)}
                  spanColor={getSpanColor(
                    calculateScore(cars[currentIndex].price, priceGuess)
                  )}
                  handleNext={nextCar}
                  handleRestart={handleRestart}
                />
              )}
              <div
                style={{ display: showResults ? "none" : "block" }}
                className={styles.mainSideContainer}
              >
                <div className={styles.topSide}>
                  <div className={styles.imageSlider}>
                    <button
                      onClick={() => {
                        setCurrentImageIndex((prev) =>
                          prev - 1 < 0
                            ? cars[currentIndex].images.length - 1
                            : prev - 1
                        );
                      }}
                      className={styles.sliderButtons}
                    >
                      <LeftArrow stroke="white"></LeftArrow>
                    </button>
                    <img
                      src={cars[currentIndex]?.images[currentImageIndex]}
                      alt="Car Image"
                    ></img>
                    <button
                      className={styles.sliderButtons}
                      onClick={() => {
                        setCurrentImageIndex(
                          (prev) =>
                            (prev + 1) % cars[currentIndex].images.length
                        );
                      }}
                    >
                      <RightArrow stroke="white"></RightArrow>
                    </button>
                  </div>
                  <div className={styles.infoBoxes}>
                    <div className={styles.infoBox}>
                      <CarSvg stroke="#f6a80b" />
                      {cars[currentIndex].title}
                    </div>
                    <div className={styles.infoBox}>
                      <CalendarSvg fill="#f6a80b" stroke="#f6a80b" />
                      {cars[currentIndex].year}
                    </div>
                    <div className={styles.infoBox}>
                      <OdometerSvg stroke="#f6a80b" fill="#f6a80b" />
                      {cars[currentIndex].mileage}
                    </div>
                    <div className={styles.infoBox}>
                      <EngineSvg stroke="#f6a80b" />
                      {engineTranslation(
                        cars[currentIndex].engine.replace(
                          "a.g.",
                          t("price_guesser.horse_power")
                        )
                      )}
                    </div>
                    <div className={styles.infoBox}>
                      <TransmissionSvg fill="#f6a80b" stroke="#f6a80b" />
                      {t(
                        "price_guesser.transmission_types." +
                          cars[currentIndex].transmission.toLowerCase()
                      ) || cars[currentIndex].transmission}
                    </div>
                  </div>
                </div>
                <div className={styles.bottomSide}>
                  <div className={styles.priceInputSide}>
                    <div className={styles.priceInputSideContainer}>
                      <div className={styles.priceInputDiv}>
                        <span className={styles.manatSymbol}>&#x20BC;</span>
                        <input
                          value={numberWithCommas(priceGuess)}
                          min={0}
                          onKeyDown={handleInputChange}
                          onPaste={(e) => {
                            e.preventDefault();
                          }}
                          onChange={(e) => {
                            setPriceGuess(
                              Number(e.target.value.replaceAll(",", ""))
                            );
                          }}
                          className={styles.priceInput}
                        ></input>
                        <button
                          disabled={priceGuess == 0}
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
                          onClick={() => {
                            setPriceGuess((prev) => prev + 1000);
                          }}
                          className={`${styles.priceButton} ${styles.plusButton}`}
                        >
                          + 1.000 &#x20BC;
                        </button>
                        <button
                          onClick={() => {
                            setPriceGuess((prev) => prev + 2500);
                          }}
                          className={`${styles.priceButton} ${styles.plusButton}`}
                        >
                          + 2.500 &#x20BC;
                        </button>
                        <button
                          onClick={() => {
                            setPriceGuess((prev) => prev + 5000);
                          }}
                          className={`${styles.priceButton} ${styles.plusButton}`}
                        >
                          + 5.000 &#x20BC;
                        </button>
                        <button
                          onClick={() => {
                            setPriceGuess((prev) =>
                              prev - 1000 >= 0 ? prev - 1000 : 0
                            );
                          }}
                          className={`${styles.priceButton} ${styles.minusButton}`}
                        >
                          - 1.000 &#x20BC;
                        </button>
                        <button
                          onClick={() => {
                            setPriceGuess((prev) =>
                              prev - 2500 >= 0 ? prev - 2500 : 0
                            );
                          }}
                          className={`${styles.priceButton} ${styles.minusButton}`}
                        >
                          - 2.500 &#x20BC;
                        </button>
                        <button
                          onClick={() => {
                            setPriceGuess((prev) =>
                              prev - 5000 >= 0 ? prev - 5000 : 0
                            );
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
                    {results.reduce((sum, elem) => sum + elem.score, 0)} /{" "}
                    {results.length * 1000}
                  </span>
                </div>
                <div className={styles.resultDivs}>
                  {results.map((result, index) => (
                    <div key={index} className={styles.resultDiv}>
                      <span className={styles.resultTitle}>{result.title}</span>
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

export default GuessPrice;
