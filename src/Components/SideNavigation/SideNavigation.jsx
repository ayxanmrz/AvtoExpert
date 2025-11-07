import styles from "./SideNavigation.module.css";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import az_flag from "../../images/az_flag.svg";
import en_flag from "../../images/en_flag.svg";
import ru_flag from "../../images/ru_flag.svg";
import { useTheme } from "../../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

function SideNavigation(props) {
  const location = useLocation();
  const [t, i18n] = useTranslation("global");

  const { theme, toggleTheme } = useTheme();

  const MenuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    "&:hover": { backgroundColor: "var(--select-hover-bg-color)" }
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
        <li className="flex items-center justify-center">
          <button onClick={toggleTheme} className={styles.themeToggleBtn}>
            {theme === "light" ? <Moon /> : <Sun />}
            {t(`header.${theme === "light" ? "dark" : "light"}`)}
          </button>

        </li>
        <FormControl fullWidth>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            defaultValue={i18n.language}
            onChange={handleLangChange}
            sx={{
              color: "var(--select-text-color)",
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
                gap: "10px",
                "@media (max-width: 726px)": {
                  padding: "10px 32px 10px 10px",
                  fontSize: "12px",
                },
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "var(--select-border-color)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "var(--select-border-hover-color)",
              },
              "& .MuiSvgIcon-root": {
                color: "var(--select-icon-color)",
              },
              ".MuiPaper-root": {
                backgroundColor: "var(--select-bg-color)",
              },
              ".MuiButtonBase-root.Mui-selected": {
                backgroundColor: "var(--select-item-bg-color-selected)",
              },
            }}
            className={styles.langSelect}
          >
            <MenuItem sx={MenuItemStyle} value={"az"}>
              <img className={styles.flagIcon} src={az_flag} alt="AZ"></img>
              <div className="text-[var(--select-text-color)]">AZ</div>
            </MenuItem>
            <MenuItem sx={MenuItemStyle} value={"ru"}>
              <img className={styles.flagIcon} src={ru_flag} alt="RU"></img>
              <div className="text-[var(--select-text-color)]">RU</div>
            </MenuItem>
            <MenuItem sx={MenuItemStyle} value={"en"}>
              <img className={styles.flagIcon} src={en_flag} alt="EN"></img>
              <div className="text-[var(--select-text-color)]">EN</div>
            </MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
}

export default SideNavigation;
