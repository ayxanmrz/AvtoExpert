import styles from "./Finder.module.css";
import PropTypes from "prop-types";
import Slider, { SliderThumb } from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

function Finder() {
  const minDistance = 2;
  const [t, i18n] = useTranslation("global");
  const [range, setRange] = useState([20, 40]);
  const maxPrice = 150000;

  const handlePriceChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setRange([
        Math.floor(Math.min(newValue[0], range[1] - minDistance)),
        range[1],
      ]);
    } else {
      setRange([
        range[0],
        Math.floor(Math.max(newValue[1], range[0] + minDistance)),
      ]);
    }
  };

  const AirbnbSlider = {
    color: "#f6a80b",
    height: 3,
    padding: "13px 0",
    "& .MuiSlider-thumb": {
      height: 27,
      width: 27,
      backgroundColor: "#fff",
      border: "1px solid currentColor",
      "&:hover": {
        boxShadow: "0 0 0 8px rgba(137, 117, 58, 0.16)",
      },
      "& .airbnb-bar": {
        height: 9,
        width: 1,
        backgroundColor: "currentColor",
        marginLeft: 1,
        marginRight: 1,
      },
    },
    "& .Mui-focusVisible": {
      boxShadow: "0 0 0 8px rgba(137, 117, 58, 0.16)",
    },
    "& .MuiSlider-track": {
      height: 3,
    },
    "& .MuiSlider-rail": {
      color: "#d8d8d8",
      opacity: 1,
      height: 3,
    },
  };

  const names = [
    "Oliver Hansen",
    "Van Henry",
    "April Tucker",
    "Ralph Hubbard",
    "Omar Alexander",
    "Carlos Abbott",
    "Miriam Wagner",
    "Bradley Wilkerson",
    "Virginia Andrews",
    "Kelly Snyder",
  ];

  const [personName, setPersonName] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const ITEM_HEIGHT = 70;
  const ITEM_PADDING_TOP = 0;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const selectStyle = {
    m: 0,
    width: "100%",
    "& .MuiInputBase-root": {
      height: "70px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
    "& .MuiSelect-select:focus": {
      height: "100%",
    },
  };

  return (
    <div className={styles.finderDiv}>
      <div className={styles.main}>
        <div className={styles.filters}>
          <div className={styles.filterItem}>
            <label>
              {t("finder.price_range")}:{" "}
              {Math.floor((range[0] / 100) * maxPrice)} AZN -{" "}
              {Math.floor((range[1] / 100) * maxPrice)} AZN
            </label>
            <Slider
              sx={AirbnbSlider}
              value={range}
              getAriaLabel={(index) =>
                index === 0 ? "Minimum price" : "Maximum price"
              }
              onChange={handlePriceChange}
              defaultValue={[20, 40]}
              step={1}
              disableSwap
            />
          </div>
          <div className={styles.filterItem}>
            {/* <label>{t("finder.fuel_type")}</label>
            <select>
              <option>{t("finder.petrol")}</option>
              <option>{t("finder.diesel")}</option>
              <option>{t("finder.electric")}</option>
              <option>{t("finder.hybrid")}</option>
            </select> */}
            {/* <KeyboardArrowDownIcon className={styles.downArrow} /> */}
            <FormControl sx={selectStyle}>
              <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={personName}
                onChange={handleChange}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {names.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={personName.includes(name)} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className={styles.filterItem}>
            <FormControl sx={selectStyle}>
              <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={personName}
                onChange={handleChange}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {names.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={personName.includes(name)} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className={styles.filterItem}></div>
          <div className={styles.filterItem}></div>
          <div className={styles.filterItem}></div>
        </div>
      </div>
    </div>
  );
}

export default Finder;
