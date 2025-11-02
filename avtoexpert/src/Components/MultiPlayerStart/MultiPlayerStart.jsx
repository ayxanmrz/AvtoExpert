import styles from "./MultiPlayerStart.module.css";
import TextField from "@mui/material/TextField";
import PpIcon from "../../images/PriceGuessIcons/pp.svg?react";
import { useEffect, useState } from "react";
import { useSocket } from "../../SocketProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ReactGA from "react-ga4";


function MultiPlayerStart() {
  const [joinId, setJoinId] = useState("");
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [showLoginInput, setShowLoginInput] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [showJoinError, setShowJoinError] = useState(false);

  const socket = useSocket();

  let navigate = useNavigate();
  const location = useLocation();

  const [t] = useTranslation("global");

  const queryParams = new URLSearchParams(location.search);
  const redirectLobbyId = queryParams.get("redirect");

  const showToastError = (error) => {
    toast.error(error, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  useEffect(() => {
    document.title = t("price_guesser.multi_player") + " | AvtoExpert";
  }, [t]);

  useEffect(() => {
    if (!location) return;

    if (location.state?.err) {
      showToastError(t("errors." + location.state.err));
    }
  }, [location, t]);

  useEffect(() => {
    if (!socket) return;

    socket?.on("lobby-created", ({ lobbyId }) => {
      navigate("/multiplayer/" + lobbyId);
    });

    // return () => socket?.disconnect();
  }, [socket]);

  const createLobby = () => {
    if (username.trim().length > 3 && username.trim().length < 16) {
      localStorage.setItem("username", username);
      socket.emit("create-lobby", {
        roundTime: 10,
        totalRounds: 10,
      });
      ReactGA.event({
        category: "Multi Player",
        action: "Lobby Created",
        label: "Multi PLayer Lobby Created",
      });
    }
  };
  const joinLobby = () => {
    if (username.trim().length > 3 && username.trim().length < 16) {
      localStorage.setItem("username", username);
      socket.emit("check-lobby", joinId.trim().toUpperCase(), (response) => {
        if (response.status) {
          setShowJoinError(false);
          navigate("/multiplayer/" + joinId.trim().toUpperCase());
          ReactGA.event({
            category: "Multi Player",
            action: "Lobby Joined",
            label: "PLayer Joined Lobby",
          });
        } else {
          setShowJoinError(true);
          if (response.err) {
            showToastError(t("errors." + response.err));
          }
        }
      });
    }
  };

  const redirectLobby = () => {
    if (username.trim().length > 3 && username.trim().length < 16) {
      localStorage.setItem("username", username);
      navigate(`/multiplayer/${redirectLobbyId}`);
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
    if (username.trim().length > 3 && username.trim().length < 16) {
      setShowError(false);
    } else {
      if (username.trim().length < 4) {
        setErrorText(t("errors.username_min_length"));
      } else if (username.trim().length > 15) {
        setErrorText(t("errors.username_max_length"));
      } else {
        setErrorText("");
      }
      setShowError(true);
    }
  }, [username]);

  return (
    <div className={styles.main}>
      <title>{t("price_guesser.multi_player")} | AvtoExpert</title>
      <meta
        name="description"
        content="AvtoExpert Çox oyunçu rejimində dostlarınla yarış! 🚗🔥"
      />
      <div className={styles.menuDiv}>
        <PpIcon className={styles.ppIcon} />
        <TextField
          sx={CssTextField}
          className={styles.input}
          label={t("price_guesser.username")}
          variant="outlined"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              redirectLobbyId ? redirectLobby() : createLobby();
            }
          }}
          helperText={showError ? errorText : ""}
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
                helperText={
                  showJoinError ? t("errors.this_lobby_not_exist") : ""
                }
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
