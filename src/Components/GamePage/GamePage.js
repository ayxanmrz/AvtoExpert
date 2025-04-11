import { useParams } from "react-router-dom";
import styles from "./GamePage.module.css";
import { useSocket } from "../../SocketProvider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as PersonSvg } from "../../images/PriceGuessIcons/person.svg";
import { ReactComponent as SettingsSvg } from "../../images/PriceGuessIcons/settings.svg";
import { ReactComponent as CrownSvg } from "../../images/PriceGuessIcons/crown.svg";
import LinkIcon from "@mui/icons-material/Link";
import { useTranslation } from "react-i18next";
import LoadingPage from "../LoadingPage/LoadingPage";
import Alert from "@mui/material/Alert";
import GuessPriceOnline from "../GuessPriceOnline/GuessPriceOnline";
import badSound from "../../sounds/bad.mp3";
import normalSound from "../../sounds/normal.mp3";
import goodSound from "../../sounds/good.mp3";

function GamePage() {
  const { lobbyId } = useParams();
  const socket = useSocket();
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [players, setPlayers] = useState([]);
  const [currentStatus, setCurrentStatus] = useState("lobby");
  const [lobbyParams, setLobbyParams] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentCar, setCurrentCar] = useState();
  const [lastScore, setLastScore] = useState(0);

  const [showResult, setShowResult] = useState(false);

  const [timeLeft, setTimeLeft] = useState(null);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [priceGuess, setPriceGuess] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [totalNumberOfCars, setTotalNumberOfCars] = useState(0);
  const [currentRoundNumber, setCurrentRoundNumber] = useState(0);

  const [lastScores, setLastScores] = useState([]);
  const [lastPrice, setLastPrice] = useState(0);

  const [loadingNextRound, setLoadingNextRound] = useState(false);

  const [t, i18n] = useTranslation("global");
  let navigate = useNavigate();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleRoundTimeChange = (e) => {
    if (
      e.target.value >= 5 &&
      e.target.value <= 60 &&
      socket?.id === lobbyParams?.host
    ) {
      let newParams = { ...lobbyParams, roundTime: e.target.value };
      setLobbyParams(newParams);
      socket.emit("lobby-param-change", lobbyId, newParams, (response) => {});
    } else {
      if (e.target.value < 5) {
        let newParams = { ...lobbyParams, roundTime: 5 };
        setLobbyParams(newParams);
        socket.emit("lobby-param-change", lobbyId, newParams, (response) => {});
      } else if (e.target.value > 60) {
        let newParams = { ...lobbyParams, roundTime: 60 };
        setLobbyParams(newParams);
        socket.emit("lobby-param-change", lobbyId, newParams, (response) => {});
      }
    }
  };

  const handleTotalRoundChange = (e) => {
    if (
      e.target.value >= 3 &&
      e.target.value <= 30 &&
      socket?.id === lobbyParams?.host
    ) {
      let newParams = { ...lobbyParams, totalRounds: e.target.value };
      setLobbyParams(newParams);
      socket.emit("lobby-param-change", lobbyId, newParams, (response) => {});
    } else {
      if (e.target.value < 3) {
        let newParams = { ...lobbyParams, totalRounds: 3 };
        setLobbyParams(newParams);
        socket.emit("lobby-param-change", lobbyId, newParams, (response) => {});
      } else if (e.target.value > 30) {
        let newParams = { ...lobbyParams, totalRounds: 30 };
        setLobbyParams(newParams);
        socket.emit("lobby-param-change", lobbyId, newParams, (response) => {});
      }
    }
  };

  const handleStartGame = () => {
    if (socket?.id === lobbyParams?.host && currentStatus === "lobby") {
      socket.emit("start-game", lobbyId);
    }
  };

  const submitCar = (priceGuess) => {
    if (!isSubmitted) {
      socket.emit("guess-price", lobbyId, priceGuess, (callback) => {
        setLastScore(callback.score);
        setIsSubmitted(true);
      });
    }
  };

  const play = (sound) => {
    const audio = new Audio(sound);
    audio.play().catch((err) => {
      console.error("Audio play failed:", err);
    });
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

  const preloadImage = (url) => {
    const img = new Image();
    img.src = url;
  };

  useEffect(() => {
    if (!username) {
      socket.emit("check-lobby", lobbyId, (response) => {
        if (response.status) {
          navigate("/guess/multiplayer" + "?redirect=" + lobbyId);
        } else {
          navigate("/guess/multiplayer/", {
            state: { err: "this_lobby_not_exist" },
          });
        }
      });
      return;
    }

    if (socket) {
      socket.emit("join-lobby", lobbyId, username, (response) => {
        if (response.status) {
          setLobbyParams(response.lobby);
          setLoading(response.lobby.isLoading);
          if (response.lobby.currentRound > 0) {
            setLoadingNextRound(true);
            setLoading(true);
            setTotalNumberOfCars(response.lobby.totalRounds);
          }
        } else {
          if (response.err === "username_already_exists") {
            navigate("/guess/multiplayer" + "?redirect=" + lobbyId, {
              state: { err: response.err },
            });
          } else {
            navigate("/guess/multiplayer", {
              state: { err: response.err },
            });
          }
          return;
        }
      });
      socket?.on("player-joined", ({ players }) => setPlayers(players));
      socket?.on("lobby-param-changed", ({ newParams }) => {
        setLobbyParams((prev) => ({ ...prev, ...newParams }));
      });

      socket.on("loading", ({ status }) => setLoading(status));
      socket.on("game-started", ({ roundNumber }) => {
        setLoading(false);
        setCurrentStatus("game");
        setError(null);
        setTotalNumberOfCars(roundNumber);
      });
      socket.on("game-error", ({ message }) => {
        setError(message);
        setLoading(false);
      });

      socket?.on("player-left", ({ players, host }) => {
        setPlayers(players);
        if (host) {
          setLobbyParams((prev) => ({ ...prev, host }));
        }
      });
      socket?.on(
        "round-ended",
        ({ round, players, lastScores, lastPrice, nextImage }) => {
          setShowResult(true);
          setPlayers(players);
          setLastScores(lastScores);
          setLastPrice(lastPrice);
          playSoundAccScore(
            lastScores.find((player) => player.socketId === socket.id).score ||
              0
          );
          if (nextImage) {
            preloadImage(nextImage);
          }
        }
      );
      socket?.on("game-ended", () => {
        setCurrentStatus("lobby"); // Return to lobby
        setShowResult(false);
        setLastScore(0);
        setCurrentCar(null);
        setLoading(false);
        setLoadingNextRound(false);
      });

      return () => {
        // socket.disconnect();
        socket.off("player-joined");
        socket.off("lobby-param-changed");
        socket.off("loading");
        socket.off("game-started");
        socket.off("game-error");
        socket.off("player-left");
        socket.off("round-ended");
        socket.off("game-ended");
        socket.emit("player-left");
      };
    }
  }, [socket, lobbyId, username]);

  useEffect(() => {
    socket?.on("round-started", ({ round, currentCar, startTime }) => {
      if (loadingNextRound) {
        setLoadingNextRound(false);
        setLoading(false);
        setCurrentStatus("game");
      }

      setCurrentCar(currentCar);
      setShowResult(false);
      setLastScore(0);
      setIsSubmitted(false);
      setCurrentImageIndex(0);
      setPriceGuess(0);
      setCurrentRoundNumber(round);

      const endTime = startTime + lobbyParams.roundTime * 1000;

      // Set interval to decrease every 0.2 seconds
      const interval = setInterval(() => {
        const remaining = Math.max(
          0,
          ((endTime - Date.now()) / 1000).toFixed(1)
        );
        setTimeLeft(remaining);

        if (remaining <= 0) clearInterval(interval); // Stop when it reaches 0
      }, 100);

      return () => clearInterval(interval);
    });

    return () => socket?.off("round-started");
  }, [socket, lobbyParams, loadingNextRound]);

  return (
    // <>
    //   LobbyId: {lobbyId}, Socket: {socket?.id}
    //   <hr></hr>
    //   Players:
    //   <br />{" "}
    //   {players.length > 0 &&
    //     players.map((player) => (
    //       <>
    //         {player.username + " " + player.socketId}
    //         <br />
    //       </>
    //     ))}
    // </>
    <div className={styles.main}>
      {currentStatus === "game" && (
        <>
          <GuessPriceOnline
            currentCar={currentCar}
            isLast={currentRoundNumber === totalNumberOfCars}
            handleSubmitCar={(priceGuess) => {
              if (!showResult) submitCar(priceGuess);
            }}
            showResult={showResult}
            results={players}
            lastScore={lastScore}
            timer={(timeLeft / lobbyParams.roundTime) * 100}
            isSubmitted={isSubmitted}
            priceGuess={priceGuess}
            setPriceGuess={setPriceGuess}
            currentImageIndex={currentImageIndex}
            setCurrentImageIndex={setCurrentImageIndex}
            totalNumberOfCars={totalNumberOfCars}
            currentRoundNumber={currentRoundNumber}
            lastScores={lastScores}
            lastPrice={lastPrice}
          />
        </>
      )}
      {error && (
        <Alert
          sx={{ position: "absolute", top: "10px", right: "10px" }}
          variant="filled"
          severity="error"
        >
          {error}
        </Alert>
      )}
      {loading && <LoadingPage isLoadingNextRound={loadingNextRound} />}
      {currentStatus === "lobby" && !loading && (
        <div className={styles.lobbyDiv}>
          <div className={styles.lobbyInfoSide}>
            <div
              style={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                borderRight: "1px solid rgb(229, 231, 235)",
              }}
              className={styles.playersSideContainer}
            >
              <div
                style={{ minHeight: "48.5px", boxSizing: "border-box" }}
                className={styles.playersTop}
              >
                <SettingsSvg
                  style={{ width: "24px", height: "24px" }}
                  stroke="#f6a80b"
                />
                {t("price_guesser.lobby_info")}
              </div>
              <div className={styles.lobbyInfoBottom}>
                <div className={styles.lobbyIdDiv}>
                  <div className={styles.lobbyId}>{lobbyId}</div>
                  <button
                    onClick={handleCopyLink}
                    className={styles.copyButton}
                  >
                    <LinkIcon
                      style={{ color: "white" }}
                      width="20px"
                      height="20px"
                    />
                    {t("price_guesser.copy_invite_link")}
                  </button>
                </div>
                <div className={styles.lobbySettingsDiv}>
                  <div className={styles.inputSection}>
                    <label htmlFor="roundDuration">
                      {t("price_guesser.round_duration")}:
                    </label>
                    <input
                      min={5}
                      max={60}
                      value={lobbyParams?.roundTime || 10}
                      onChange={handleRoundTimeChange}
                      id="roundDuration"
                      type="number"
                      disabled={socket?.id !== lobbyParams?.host}
                    />
                  </div>
                  <div className={styles.inputSection}>
                    <label htmlFor="roundNumber">
                      {t("price_guesser.number_of_rounds")}:
                    </label>
                    <input
                      min={3}
                      max={30}
                      onChange={handleTotalRoundChange}
                      value={lobbyParams?.totalRounds || 3}
                      id="roundNumber"
                      type="number"
                      disabled={socket?.id !== lobbyParams?.host}
                    />
                  </div>
                </div>
                <div className={styles.lobbyStartDiv}>
                  <button
                    disabled={socket?.id !== lobbyParams?.host}
                    className={styles.copyButton}
                    onClick={handleStartGame}
                  >
                    {socket?.id === lobbyParams?.host
                      ? t("price_guesser.start_game")
                      : t("price_guesser.waiting_for_host")}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.playersSide}>
            <div
              style={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
              className={styles.playersSideContainer}
            >
              <div className={styles.playersTop}>
                <PersonSvg
                  style={{ width: "24px", height: "24px" }}
                  stroke="#f6a80b"
                />
                {t("price_guesser.players")}
                <span className={styles.scoreSpan}>{players.length}</span>
              </div>
              <div className={styles.playerDivs}>
                {players.map((player, index) => (
                  <div key={index} className={styles.playerDiv}>
                    <span className={styles.playerTitle}>
                      {player.username}
                      {player.socketId === lobbyParams?.host && (
                        <div
                          style={{ backgroundColor: "rgb(255, 247, 237)" }}
                          className={styles.hostSpan}
                        >
                          <CrownSvg
                            width="15px"
                            height="15px"
                            fill="rgb(251, 191, 36)"
                            stroke="rgb(251, 191, 36)"
                          />
                        </div>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GamePage;
