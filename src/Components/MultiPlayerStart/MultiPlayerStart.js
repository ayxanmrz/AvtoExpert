import styles from "./MultiPlayerStart.module.css";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { ReactComponent as PpIcon } from "../../images/PriceGuessIcons/pp.svg";
import { useEffect, useState } from "react";
import { useSocket } from "../../SocketProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";

function MultiPlayerStart() {
  const [lobbyId, setLobbyId] = useState("");
  const [joinId, setJoinId] = useState("");
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [players, setPlayers] = useState([]);
  const [showLoginInput, setShowLoginInput] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showJoinError, setShowJoinError] = useState(false);

  const socket = useSocket();

  let navigate = useNavigate();
  const location = useLocation();

  const [t, i18n] = useTranslation("global");

  const queryParams = new URLSearchParams(location.search);
  const redirectLobbyId = queryParams.get("redirect");

  const [error, setError] = useState();

  useEffect(() => {
    if (!location) return;

    if (location.state?.err) {
      setError(t("errors." + location.state.err));
    }
  }, [location, t]);

  useEffect(() => {
    if (!socket) return;

    socket?.on("lobby-created", ({ lobbyId }) => {
      navigate("/guess/multiplayer/" + lobbyId);
    });

    // return () => socket?.disconnect();
  }, [socket]);

  const createLobby = () => {
    if (username.trim().length > 3) {
      localStorage.setItem("username", username);
      socket.emit("create-lobby", {
        roundTime: 10,
        totalRounds: 3,
      });
    }
  };
  const joinLobby = () => {
    if (username.trim().length > 3) {
      localStorage.setItem("username", username);
      socket.emit("check-lobby", joinId, (response) => {
        if (response.status) {
          setShowJoinError(false);
          navigate("/guess/multiplayer/" + joinId);
        } else {
          setShowJoinError(true);
          if (response.err) {
            setError(t("errors." + response.err));
          }
        }
      });
    }
  };

  const redirectLobby = () => {
    if (username.trim().length > 3) {
      localStorage.setItem("username", username);
      navigate(`/guess/multiplayer/${redirectLobbyId}`);
    }
  };

  const CssTextField = {
    "& label.Mui-focused": {
      color: "#f6a80b",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#f6a80b",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#E0E3E7",
      },
      "&:hover fieldset": {
        borderColor: "#dc970e",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#f6a80b",
      },
    },
    "& .MuiFormHelperText-root": {
      margin: "3px 0 0 0",
    },
  };

  useEffect(() => {
    if (username.trim().length > 3) {
      setShowError(false);
    } else {
      setShowError(true);
    }
  }, [username]);

  return (
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
      <div className={styles.menuDiv}>
        <PpIcon className={styles.ppIcon} />
        <TextField
          sx={CssTextField}
          className={styles.input}
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          helperText={
            showError
              ? "Please enter a valid username. Min. 4 symbols long."
              : ""
          }
          error={showError}
          fullWidth
        />
        <div className={styles.buttons}>
          <button
            className={styles.button}
            onClick={redirectLobbyId ? redirectLobby : createLobby}
            disabled={showError}
          >
            {redirectLobbyId
              ? t("price_guesser.join_lobby")
              : t("price_guesser.create_lobby")}
          </button>
          {!redirectLobbyId && (
            <div
              className={
                styles.joinDiv + " " + (showLoginInput && styles.joinDivShow)
              }
            >
              <TextField
                sx={{
                  ...CssTextField,
                  "& .MuiInputBase-root, & .MuiInputBase-input": {
                    height: "41.5px",
                    paddingBottom: "0",
                    paddingTop: "0",
                  },
                  "& .MuiInputBase-root": {
                    borderRadius: "8px",
                  },
                  "& .MuiInputLabel-root:not(.Mui-focused, .MuiFormLabel-filled)":
                    {
                      transform: "translate(14px,10px) scale(1)",
                      WebkitTransform: "translate(14px,10px) scale(1)",
                    },
                }}
                value={joinId}
                onChange={(e) => {
                  setJoinId(e.target.value);
                }}
                helperText={showJoinError ? "This lobby doesn't exist." : ""}
                fullWidth
                label="Lobby ID"
                onKeyDown={(e) => {
                  if (e.key === "Enter") joinLobby();
                }}
              />
              <button
                className={styles.button}
                onClick={
                  showLoginInput
                    ? joinLobby
                    : () => {
                        setShowLoginInput(true);
                      }
                }
                disabled={showError}
              >
                {showLoginInput ? "->" : t("price_guesser.join_lobby")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MultiPlayerStart;
