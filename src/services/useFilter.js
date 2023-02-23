import { useState } from "react";

export default function useFilter(initialFilters) {
  const getStateFromArray = (filters) => {
    const state = {};
    filters.forEach((filter) => {
      state[filter.key] = {
        name: filter.name,
        value: filter.default,
        default: filter.default,
      };
    });
    return state;
  };

  const filterState = getStateFromArray(initialFilters);
  const [state, setState] = useState(filterState);

  const handleChangeState = (event, { id }) => {
    const value = event.target.value;

    setState((prevState) => {
      const newState = { ...prevState };
      newState[id].value = value;
      return newState;
    });
  };

  const clearFilters = () => {
    const newState = {};
    Object.keys(state).forEach((key) => {
      newState[key] = {
        name: state[key].name,
        value: state[key].default,
        default: state[key].default,
      };
    });

    setState(newState);
  };

  const getArrayFromState = () => {
    const filters = [];
    Object.keys(state).forEach((key) => {
      filters.push({
        key,
        name: state[key].name,
        value: state[key].value,
        default: state[key].default,
      });
    });
    return filters;
  };

  const filters = getArrayFromState();

  return {
    state,
    handleChangeState,
    clearFilters,
    filters,
  };
}
