import styles from "./Header.module.css";
import Logo from "../../images/logo.svg";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuIcon from "@mui/icons-material/Menu";

import az_flag from "../../images/az_flag.svg";
import en_flag from "../../images/en_flag.svg";
import ru_flag from "../../images/ru_flag.svg";

function Header(props) {
  const location = useLocation();
  const [t, i18n] = useTranslation("global");

  const [langSelectShow, setLangSelectShow] = useState(false);

  const MenuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const handleLangChange = (e) => {
    i18n.changeLanguage(e.target.value);
    localStorage.setItem("lang", e.target.value);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 625) {
        setLangSelectShow(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={styles.headerDiv}>
      <div className={styles.main}>
        <div className={styles.logoDiv}>
          <Link to="/">
            <img src={Logo} alt="Avto Expert"></img>
          </Link>
        </div>

        <div className={styles.buttons}>
          <ul>
            <li className={styles.menuIcon}>
              <IconButton
                onClick={props.handleOpenDrawer}
                aria-label="menu-button"
              >
                <MenuIcon />
              </IconButton>
            </li>
            <li>
              {" "}
              <Link
                to="/"
                className={
                  location.pathname === "/" ? styles.activePath : undefined
                }
              >
                {t("header.home")}
              </Link>
            </li>
            <li>
              {" "}
              <Link
                to="/singleplayer"
                className={
                  location.pathname.startsWith("/singleplayer")
                    ? styles.activePath
                    : undefined
                }
              >
                {t("header.single_player")}
              </Link>
            </li>
            <li>
              {" "}
              <Link
                to="/multiplayer"
                className={
                  location.pathname.startsWith("/multiplayer")
                    ? styles.activePath
                    : undefined
                }
              >
                {t("header.multi_player")}
              </Link>
            </li>
            <li>
              {" "}
              <Link
                to="/contact"
                className={
                  location.pathname === "/contact"
                    ? styles.activePath
                    : undefined
                }
              >
                {t("header.contact")}
              </Link>
            </li>
            <li>
              <FormControl fullWidth>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  defaultValue={i18n.language}
                  onChange={handleLangChange}
                  sx={{
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      "@media (max-width: 726px)": {
                        padding: "10px 32px 10px 10px",
                        fontSize: "12px",
                      },
                    },
                  }}
                  onOpen={() => setLangSelectShow(true)}
                  onClose={() => setLangSelectShow(false)}
                  open={langSelectShow}
                  className={styles.langSelect}
                >
                  <MenuItem sx={MenuItemStyle} value={"az"}>
                    <img
                      className={styles.flagIcon}
                      src={az_flag}
                      alt="AZ"
                    ></img>
                    <div>AZ</div>
                  </MenuItem>
                  <MenuItem sx={MenuItemStyle} value={"ru"}>
                    <img
                      className={styles.flagIcon}
                      src={ru_flag}
                      alt="RU"
                    ></img>
                    <div>RU</div>
                  </MenuItem>
                  <MenuItem sx={MenuItemStyle} value={"en"}>
                    <img
                      className={styles.flagIcon}
                      src={en_flag}
                      alt="EN"
                    ></img>
                    EN
                  </MenuItem>
                </Select>
              </FormControl>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;
