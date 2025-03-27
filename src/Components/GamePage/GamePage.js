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

function GamePage() {
  const { lobbyId } = useParams();
  const socket = useSocket();
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [players, setPlayers] = useState([]);
  const [currentStatus, setCurrentStatus] = useState("lobby");
  const [lobbyParams, setLobbyParams] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      socket.emit("lobby-param-change", lobbyId, newParams, (response) => {
        console.log("Lobby param change status: " + response.status);
      });
    } else {
      e.preventDefault();
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
      socket.emit("lobby-param-change", lobbyId, newParams, (response) => {
        console.log("Lobby param change status: " + response.status);
      });
    } else {
      e.preventDefault();
    }
  };

  const handleStartGame = () => {
    if (socket?.id === lobbyParams?.host && currentStatus === "lobby") {
      socket.emit("start-game", lobbyId);
      console.log("Start Called");
    } else {
      console.log("Start Not Called");
    }
  };

  useEffect(() => {
    console.log("---------------------");
    console.log(lobbyParams);
    console.log(players);
    console.log("---------------------");
  }, [lobbyParams, players]);

  useEffect(() => {
    if (!username) {
      navigate("/guess-the-price/multiplayer"); // Redirect if no username
      return;
    }

    if (socket) {
      socket.emit("join-lobby", lobbyId, username, (response) => {
        console.log(response.status);
        if (response.status) {
          setLobbyParams(response.lobby);
          console.log(response.lobby);
        }
      });
      socket?.on("player-joined", ({ players }) => setPlayers(players));
      socket?.on("lobby-param-changed", ({ newParams }) => {
        setLobbyParams((prev) => ({ ...prev, ...newParams }));
      });

      socket.on("loading", ({ status }) => setLoading(status));
      socket.on("game-started", () => {
        setLoading(false);
        setCurrentStatus("game");
        setError(null);
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
      socket?.on("round-started", ({ round }) =>
        console.log(`Round ${round} started`)
      );
      socket?.on("round-ended", ({ round }) =>
        console.log(`Round ${round} ended`)
      );
      socket?.on("game-ended", () => console.log("Game over"));

      return () => {
        socket.disconnect();
      };
    }
  }, [socket, lobbyId, username]);
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
      {error && (
        <Alert
          sx={{ position: "absolute", top: "10px", right: "10px" }}
          variant="filled"
          severity="error"
        >
          {error}
        </Alert>
      )}
      {loading && <LoadingPage />}
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
