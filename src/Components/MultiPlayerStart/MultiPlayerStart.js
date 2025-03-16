import styles from "./MultiPlayerStart.module.css";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { ReactComponent as PpIcon } from "../../images/PriceGuessIcons/pp.svg";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

function MultiPlayerStart() {
  const [lobbyId, setLobbyId] = useState("");
  const [joinId, setJoinId] = useState("");
  const [username, setUsername] = useState("");
  const [players, setPlayers] = useState([]);
  const [showLoginInput, setShowLoginInput] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    socket.on("lobby-created", ({ lobbyId }) => {
      setLobbyId(lobbyId);
    });
    socket.on("player-joined", ({ players }) => setPlayers(players));
    socket.on("round-started", ({ round }) =>
      console.log(`Round ${round} started`)
    );
    socket.on("round-ended", ({ round }) =>
      console.log(`Round ${round} ended`)
    );
    socket.on("game-ended", () => console.log("Game over"));

    return () => socket.disconnect();
  }, []);

  const createLobby = () => {
    const newLobbyId = Math.random().toString(36).substr(2, 5);
    socket.emit("create-lobby", {
      lobbyId: newLobbyId,
      roundTime: 10,
      totalRounds: 3,
    });
  };
  const startLobby = () => {
    socket.emit("start-game", {
      lobbyId: lobbyId,
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
          <button className={styles.button} onClick={createLobby}>
            Create Lobby
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
              fullWidth
              label="Lobby ID"
            />
            <button
              className={styles.button}
              onClick={
                showLoginInput
                  ? startLobby
                  : () => {
                      setShowLoginInput(true);
                    }
              }
            >
              {showLoginInput ? "->" : "Join Lobby"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MultiPlayerStart;
