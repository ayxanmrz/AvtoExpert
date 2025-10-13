import styles from "./SideNavigation.module.css";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import az_flag from "../../images/az_flag.svg";
import en_flag from "../../images/en_flag.svg";
import ru_flag from "../../images/ru_flag.svg";

function SideNavigation(props) {
  const location = useLocation();
  const [t, i18n] = useTranslation("global");

  const MenuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const handleLangChange = (e) => {
    i18n.changeLanguage(e.target.value);
    localStorage.setItem("lang", e.target.value);
  };

  const handleRouteChange = () => {
    props.closeDrawer();
  };
  return (
    <div className={styles.main}>
      <ul className={styles.linksList}>
        <li>
          {" "}
          <Link
            to="/"
            className={
              location.pathname === "/" ? styles.activePath : undefined
            }
            onClick={handleRouteChange}
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
            onClick={handleRouteChange}
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
            onClick={handleRouteChange}
          >
            {t("header.multi_player")}
          </Link>
        </li>
        <li>
          {" "}
          <Link
            to="/contact"
            className={
              location.pathname === "/contact" ? styles.activePath : undefined
            }
            onClick={handleRouteChange}
          >
            {t("header.contact")}
          </Link>
        </li>
      </ul>
      <div className={styles.langSelectDiv}>
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
            className={styles.langSelect}
          >
            <MenuItem sx={MenuItemStyle} value={"az"}>
              <img className={styles.flagIcon} src={az_flag} alt="AZ"></img>
              <div>AZ</div>
            </MenuItem>
            <MenuItem sx={MenuItemStyle} value={"ru"}>
              <img className={styles.flagIcon} src={ru_flag} alt="RU"></img>
              <div>RU</div>
            </MenuItem>
            <MenuItem sx={MenuItemStyle} value={"en"}>
              <img className={styles.flagIcon} src={en_flag} alt="EN"></img>
              EN
            </MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
}

export default SideNavigation;
