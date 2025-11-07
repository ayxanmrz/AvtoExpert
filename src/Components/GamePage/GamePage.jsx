import { useParams } from "react-router-dom";
import styles from "./GamePage.module.css";
import { useSocket } from "../../SocketProvider";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonSvg from "../../images/PriceGuessIcons/person.svg?react";
import SettingsSvg from "../../images/PriceGuessIcons/settings.svg?react";
import CrownSvg from "../../images/PriceGuessIcons/crown.svg?react";
import BanIcon from "../../images/PriceGuessIcons/ban.svg?react";
import LinkIcon from "@mui/icons-material/Link";
import { useTranslation } from "react-i18next";
import LoadingPage from "../LoadingPage/LoadingPage";
import GuessPriceOnline from "../GuessPriceOnline/GuessPriceOnline";
import badSound from "../../sounds/bad.mp3";
import normalSound from "../../sounds/normal.mp3";
import goodSound from "../../sounds/good.mp3";
import { toast } from "react-toastify";
import ReactGA from "react-ga4";
import getCorrectSuffix from "./GetCorrectSuffix";
import { ArrowUp, ArrowDown, RotateCcw } from "lucide-react";

function GamePage() {
  const { lobbyId } = useParams();
  const socket = useSocket();
  const username = localStorage.getItem("username");

  const [players, setPlayers] = useState([]);
  const [currentStatus, setCurrentStatus] = useState("lobby");
  const [lobbyParams, setLobbyParams] = useState(null);

  const [loading, setLoading] = useState(false);

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
  const [myRank, setMyRank] = useState(0);

  const [loadingNextRound, setLoadingNextRound] = useState(false);

  const clientId = localStorage.getItem("clientId") || null;

  const [t, i18n] = useTranslation("global");
  let navigate = useNavigate();

  const [serverOffset, setServerOffset] = useState(0);

  const myRankRef = useRef(0);

  useEffect(() => {
    myRankRef.current = myRank;
  }, [myRank]);

  useEffect(() => {
    if (!socket) return;

    const measureOffset = () => {
      const start = Date.now();
      socket.emit("get-server-time", (serverNow) => {
        const rtt = Date.now() - start;
        const latency = rtt / 2;
        const offset = serverNow + latency - Date.now();
        setServerOffset(offset);
        console.log("Offset updated:", offset, "ms");
      });
    };

    // measure now + every 10s
    measureOffset();
    const interval = setInterval(measureOffset, 10000);
    return () => clearInterval(interval);
  }, [socket]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleParamInput = (param, min, max) => (e) => {
    setLobbyParams((prev) => ({
      ...prev,
      [param]: e.target.value, // allow free typing (string)
    }));
  };

  const handleParamCommit = (param, min, max) => () => {
    commitLobbyParam(param, lobbyParams[param], min, max);
  };

  /**
   * Commit the typed value:
   * - clamp it
   * - update local lobbyParams immediately
   * - emit to server (with optional ack callback)
   * Returns the committed numeric value.
   */
  const commitLobbyParam = (param, value, min, max) => {
    const clamped = Math.max(min, Math.min(max, Number(value) || min));
    const newParams = { ...lobbyParams, [param]: clamped };

    setLobbyParams(newParams);
    socket?.emit("lobby-param-change", lobbyId, newParams, () => { });

    return clamped;
  };

  const handleStartGame = () => {
    if (socket?.id === lobbyParams?.host && currentStatus === "lobby") {
      commitLobbyParam("totalRounds", lobbyParams.totalRounds, 3, 50);
      commitLobbyParam("roundTime", lobbyParams.roundTime, 5, 60);
      socket.emit("start-game", lobbyId, lobbyParams);
      ReactGA.event({
        category: "Multi Player",
        action: "Game Started",
        label: "Multi PLayer Game Started",
      });
    }
  };

  const submitCar = (priceGuess) => {
    if (!isSubmitted) {
      socket.emit("guess-price", lobbyId, priceGuess, (callback) => {
        setLastScore(callback.score);
        setIsSubmitted(true);
      });
      ReactGA.event({
        category: "Multi Player",
        action: "Guess Made",
        label: "PLayer made a guess",
      });
    }
  };

  const play = (sound) => {
    const audio = new Audio(sound);
    audio.play().catch((err) => {
      console.error("Audio play failed:", err);
    });
  };

  const banPlayer = (socketId) => {
    if (socket?.id === lobbyParams?.host) {
      socket.emit("ban-player", lobbyId, socketId, (response) => {
        if (!response.status) {
          console.error("Failed to ban player:", response.err);
        }
      });
    }
  };

  const makePlayerHost = (socketId) => {
    if (socket?.id === lobbyParams?.host) {
      socket.emit("make-host", lobbyId, socketId, (response) => {
        if (!response.status) {
          console.error("Failed to make player host:", response.err);
        }
      });
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

  const getSpanColor = (score) => {
    if (score > 850) {
      return styles.greenSpan;
    } else if (score > 500) {
      return styles.yellowSpan;
    } else {
      return styles.redSpan;
    }
  };

  const preloadImage = (url) => {
    const img = new Image();
    img.src = url;
  };

  const showRankChangeToast = (rank, direction) => {
    const isUp = direction === "up";

    const icon = isUp ? (
      <ArrowUp className="inline-block mr-2" size={22} />
    ) : (
      <ArrowDown className="inline-block mr-2" size={22} />
    );

    const toastFn = isUp ? toast.success : toast.error;
    const key = isUp ? "price_guesser.rank_up" : "price_guesser.rank_down";
    const msg = t(key);

    const [before, after] = msg.split("#");

    toastFn(
      <div>
        {icon}
        <span>
          {before}
          <b>{rank}</b>
          {after}
        </span>
      </div>,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        icon: false,
      }
    );
  };

  const handleResetPoints = () => {
    if (socket?.id === lobbyParams?.host) {
      socket.emit("reset-points", lobbyId, (response) => {
        if (!response.status) {
          console.error("Failed to reset points:", response.err);
        } else {
          setLobbyParams((prev) => ({ ...prev, isDirty: false }));
        }
      });
    }
  }

  useEffect(() => {
    if (!username) {
      socket.emit("check-lobby", lobbyId, (response) => {
        if (response.status) {
          navigate("/multiplayer" + "?redirect=" + lobbyId);
        } else {
          navigate("/multiplayer/", {
            state: { err: "this_lobby_not_exist" },
          });
        }
      });
      return;
    }

    if (socket) {
      socket.emit("join-lobby", lobbyId, username, clientId, (response) => {
        if (response.status) {
          localStorage.setItem("clientId", response.clientId);
          setLobbyParams(response.lobby);
          document.title = `${lobbyId} | AvtoExpert`;
          setLoading(response.lobby.isLoading);
          if (response.lobby.currentRound > 0) {
            setLoadingNextRound(true);
            setLoading(true);
            setTotalNumberOfCars(response.lobby.totalRounds);
          }
        } else {
          if (response.err === "username_already_exists") {
            navigate("/multiplayer" + "?redirect=" + lobbyId, {
              state: { err: response.err },
            });
          } else {
            navigate("/multiplayer", {
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
        setTotalNumberOfCars(roundNumber);
        setLobbyParams((prev) => ({ ...prev, isDirty: true }));
      });
      socket.on("game-error", ({ message }) => {
        toast.error(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setLoading(false);
      });

      socket?.on("player-left", ({ players, host }) => {
        setPlayers(players);
        if (host) {
          setLobbyParams((prev) => ({ ...prev, host }));
        }
      });

      socket?.on("you-are-banned", (data) => {
        navigate("/multiplayer", {
          state: { err: "you_are_banned", lobbyId: data.lobbyId },
        });
      });

      socket?.on("host-changed", (data) => {
        setLobbyParams((prev) => ({ ...prev, host: data.newHost }));
        if (data.newHost === socket.id) {
          toast.info(t("price_guesser.notifications.you_are_host"), {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
      });

      socket?.on("points-reset", (data) => {
        setLobbyParams((prev) => ({ ...prev, isDirty: false }));
        setPlayers(data.players);
      });

      socket?.on(
        "round-ended",
        ({ round, players, lastScores, lastPrice, nextImage }) => {
          setShowResult(true);
          setPlayers(players);
          setLastScores(lastScores);
          setLastPrice(lastPrice);
          playSoundAccScore(
            lastScores.find((player) => player.socketId === socket.id)?.score ||
            0
          );
          let sortedPlayers = [...players].sort((a, b) => b.score - a.score);
          let myNewRank =
            sortedPlayers.findIndex((p) => p.socketId === socket.id) + 1;
          const prevRank = myRankRef.current;
          if (prevRank !== 0 && myNewRank !== prevRank) {
            showRankChangeToast(
              getCorrectSuffix(myNewRank, i18n.language),
              myNewRank < prevRank ? "up" : "down"
            );
          }
          setMyRank(myNewRank);

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
        document.title = `${lobbyId} | AvtoExpert`;
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
        socket.off("host-changed");
        socket.off("you-are-banned");
        socket.off("points-reset");
        socket.emit("player-left");
      };
    }
  }, [socket, lobbyId, username]);

  useEffect(() => {
    socket?.on("round-started", ({ round, currentCar, endTime }) => {
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
      document.title = `${lobbyId} - ${t("price_guesser.round")} ${round}/${lobbyParams?.totalRounds
        } | AvtoExpert`;

      const interval = setInterval(() => {
        // use corrected clock
        const now = Date.now() + serverOffset;
        const remaining = Math.max(0, ((endTime - now) / 1000).toFixed(1));
        setTimeLeft(remaining);

        if (remaining <= 0) clearInterval(interval);
      }, 100);

      return () => clearInterval(interval);
    });

    return () => socket?.off("round-started");
  }, [socket, lobbyParams, loadingNextRound, serverOffset]);

  return (
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
            timer={
              lobbyParams?.roundTime
                ? (timeLeft / lobbyParams.roundTime) * 100
                : 0
            }
            socketId={socket?.id}
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
      {loading && <LoadingPage isLoadingNextRound={loadingNextRound} />}
      {currentStatus === "lobby" && !loading && (
        <div className={styles.lobbyDiv}>
          <div className={styles.lobbyInfoSide}>
            <div
              style={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                borderRight: "1px solid var(--main-page-border-color)",
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
                  <div className={`${styles.lobbyId} leading-none`}>
                    {lobbyId}
                  </div>
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
                    <label htmlFor="roundDuration" className="text-[var(--lobby-param-color)]">
                      {t("price_guesser.round_duration")}:
                    </label>
                    <input
                      id="roundDuration"
                      type="number"
                      min={5}
                      max={60}
                      inputMode="numeric"
                      className=""
                      value={lobbyParams?.roundTime ?? ""}
                      onChange={handleParamInput("roundTime", 5, 60)}
                      onBlur={handleParamCommit("roundTime", 5, 60)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          commitLobbyParam(
                            "roundTime",
                            lobbyParams.roundTime,
                            5,
                            60
                          );
                        }
                      }}
                      disabled={socket?.id !== lobbyParams?.host}
                    />
                  </div>
                  <div className={styles.inputSection}>
                    <label htmlFor="roundNumber" className="text-[var(--lobby-param-color)]">
                      {t("price_guesser.number_of_rounds")}:
                    </label>
                    <input
                      id="roundNumber"
                      type="number"
                      min={3}
                      max={50}
                      inputMode="numeric"
                      value={lobbyParams?.totalRounds ?? ""}
                      onChange={handleParamInput("totalRounds", 3, 50)}
                      onBlur={handleParamCommit("totalRounds", 3, 50)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          commitLobbyParam(
                            "totalRounds",
                            lobbyParams.totalRounds,
                            3,
                            50
                          );
                        }
                      }}
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
                <div className="ml-auto flex items-center gap-2">
                  {(socket?.id === lobbyParams?.host && lobbyParams?.isDirty) && (<button onClick={handleResetPoints} className={`${styles.scoreSpan}  ${styles.redSpan} !pl-2.5 !pr-3 flex items-center gap-2 transition cursor-pointer hover:bg-red-500 hover:text-red-50`}><RotateCcw width="20px" /> {t("price_guesser.reset_points")}</button>)}
                  <span className={styles.scoreSpan}>{players.length}</span>
                </div>
              </div>
              <div className={styles.playerDivs}>
                {players
                  .sort((a, b) => {
                    if (a.socketId === lobbyParams?.host) return -1;
                    if (b.socketId === lobbyParams?.host) return 1;
                    return 0;
                  })
                  .map((player, index) => (
                    <div key={index} className={styles.playerDiv}>
                      <span className={styles.playerTitle}>
                        <span>
                          {player.username}
                          {player.socketId === socket.id && (
                            <span
                              style={{ fontStyle: "italic", color: "gray" }}
                            >
                              {" "}
                              ({t("price_guesser.you")})
                            </span>
                          )}
                        </span>
                        {player.socketId === lobbyParams?.host && (
                          <>
                            <div
                              className={styles.hostSpan}
                            >
                              <CrownSvg
                                width="15px"
                                height="15px"
                                fill="rgb(251, 191, 36)"
                                stroke="rgb(251, 191, 36)"
                              />
                            </div>
                          </>
                        )}
                      </span>

                      {socket?.id === lobbyParams?.host &&
                        player.socketId !== lobbyParams?.host && (
                          <div className={styles.hostButtons}>
                            <button
                              title={t("price_guesser.ban_player")}
                              className={styles.hostButton}
                              onClick={() => banPlayer(player.socketId)}
                            >
                              <BanIcon
                                width="15px"
                                height="15px"
                                fill="#fff"
                              ></BanIcon>
                            </button>
                            <button
                              title={t("price_guesser.make_player_host")}
                              className={styles.hostButton}
                              onClick={() => makePlayerHost(player.socketId)}
                            >
                              <CrownSvg
                                width="15px"
                                height="15px"
                                fill="#fff"
                                stroke="#fff"
                              ></CrownSvg>
                            </button>
                          </div>
                        )}
                      {lobbyParams?.isDirty && (
                        <span
                          className={
                            styles.scoreSpan + " " + getSpanColor(player.score) + " ml-2.5"
                          }
                        >
                          {player.score}
                        </span>
                      )}

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
