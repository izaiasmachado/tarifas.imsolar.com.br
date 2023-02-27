import { useState, useRef } from "react";
import "./styles.css";

import { FormControl, MenuItem, Button } from "@material-ui/core";
import TextField from "@mui/material/TextField";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import CloseIcon from "@mui/icons-material/Close";

export default function Toolbar({
  filters,
  handleClearFilters,
  handleChangeState,
}) {
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="Filter__container">
      <div className="filter">
        <button
          className="Filter__button"
          onClick={() => setIsOpen(!isOpen)}
          variant="contained"
        >
          <div className="Filter__button_content">
            <div className="Filter__button_icon">
              <FilterAltOutlinedIcon />
            </div>
            <div className="Filter__button_text">Filtro</div>
          </div>
        </button>

        {isOpen && (
          <div ref={dropdownRef} className="filter__dropdown">
            <div className="Filter__dropdown_header">
              <div className="filter__dropdown_title">Filtros</div>
              <div
                className="filter__dropdown_closeIcon"
                onClick={() => setIsOpen(!isOpen)}
              >
                <CloseIcon />
              </div>
            </div>

            <div className="detailed-search-container section">
              <div className="detailed-search">
                <div className="detailed-search-form">
                  {(filters || []).map((filter) => (
                    <FormControl
                      key={filter.key}
                      className="Filter__select-input"
                      size="small"
                      variant="outlined"
                    >
                      <TextField
                        label={filter.name}
                        id={filter.key}
                        value={filter.value}
                        onChange={(event) =>
                          handleChangeState(event, { id: filter.key })
                        }
                        select
                      >
                        {filter.available.map((item) => (
                          <MenuItem key={item} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                      </TextField>
                    </FormControl>
                  ))}
                  <Button
                    className="Filter__button-input"
                    variant="contained"
                    color="primary"
                    onClick={handleClearFilters}
                    style={{ height: "100px", maxHeight: "50px" }}
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
