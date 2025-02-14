import styles from "./Header.module.css";
import Logo from "../../images/logo.svg";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import az_flag from "../../images/az_flag.svg";
import en_flag from "../../images/en_flag.svg";

function Header() {
  const location = useLocation();
  const [t, i18n] = useTranslation("global");

  const MenuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const handleLangChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };
  return (
    <div className={styles.main}>
      <div className={styles.logoDiv}>
        <Link to="/">
          <img src={Logo} alt="Avto Expert"></img>
        </Link>
      </div>
      <div className={styles.buttons}>
        <ul>
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
              to="/reviews"
              className={
                location.pathname === "/reviews" ? styles.activePath : undefined
              }
            >
              {t("header.reviews")}
            </Link>
          </li>
          <li>
            {" "}
            <Link
              to="/compare"
              className={
                location.pathname === "/compare" ? styles.activePath : undefined
              }
            >
              {t("header.compare")}
            </Link>
          </li>
          <li>
            {" "}
            <Link
              to="/contact"
              className={
                location.pathname === "/contact" ? styles.activePath : undefined
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
                  },
                }}
              >
                <MenuItem sx={MenuItemStyle} value={"az"}>
                  <img className={styles.flagIcon} src={az_flag} alt="AZ"></img>
                  <div>AZ</div>
                </MenuItem>
                <MenuItem sx={MenuItemStyle} value={"en"}>
                  <img className={styles.flagIcon} src={en_flag} alt="EN"></img>
                  EN
                </MenuItem>
              </Select>
            </FormControl>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Header;
