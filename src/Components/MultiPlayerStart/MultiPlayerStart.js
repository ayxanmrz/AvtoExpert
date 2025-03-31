import styles from "./MultiPlayerStart.module.css";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { ReactComponent as PpIcon } from "../../images/PriceGuessIcons/pp.svg";
import { useEffect, useState } from "react";
import { useSocket } from "../../SocketProvider";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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

  const [t, i18n] = useTranslation("global");

  let navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    socket?.on("lobby-created", ({ lobbyId }) => {
      navigate("/guess-the-price/multiplayer/" + lobbyId);
    });

    // return () => socket?.disconnect();
  }, [socket]);

  const createLobby = () => {
    localStorage.setItem("username", username);
    socket.emit("create-lobby", {
      roundTime: 10,
      totalRounds: 3,
    });
  };
  const joinLobby = () => {
    localStorage.setItem("username", username);
    socket.emit("check-lobby", joinId, (response) => {
      console.log(response.status);
      if (response.status) {
        setShowJoinError(false);
        navigate("/guess-the-price/multiplayer/" + joinId);
      } else {
        setShowJoinError(true);
      }
    });
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
            onClick={createLobby}
            disabled={showError}
          >
            {t("price_guesser.create_lobby")}
          </button>
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
        </div>
      </div>
    </div>
  );
}

export default MultiPlayerStart;
