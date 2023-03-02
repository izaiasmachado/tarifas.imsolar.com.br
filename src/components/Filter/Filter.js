import React from "react";
import "./styles.css";

import { FormControl, MenuItem, Button } from "@material-ui/core";
import TextField from "@mui/material/TextField";

export default function Toolbar({
  filters,
  handleClearFilters,
  handleChangeState,
}) {
  return (
    <div className="Filter__container">
      <div className="filter">
        <div className="filter__dropdown">
          <div className="Filter__dropdown_header">
            <div className="filter__dropdown_title">Filtros</div>
          </div>

          <div className="detailed-search-container section">
            <div className="detailed-search">
              <div className="detailed-search-form">
                <div className="Filter__filters">
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
                </div>
                <div className="Filter__button-container">
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
        </div>
      </div>
    </div>
  );
}
