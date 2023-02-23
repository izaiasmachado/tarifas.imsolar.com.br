import { FormControl, MenuItem, Button } from "@material-ui/core";
import TextField from "@mui/material/TextField";
import "./styles.css";

export default function Toolbar({
  filters,
  handleClearFilters,
  handleChangeState,
}) {
  return (
    <div className="detailed-search-container section">
      <div className="detailed-search">
        <div className="detailed-search-form">
          <div className="detailed-search-form-body">
            {(filters || []).map((filter) => (
              <FormControl
                key={filter.key}
                className="select-input"
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
          <div className="detailed-search-submit">
            <Button
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
  );
}
