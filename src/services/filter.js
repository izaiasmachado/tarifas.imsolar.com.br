const getUniqueValues = (data, key) => {
  const uniqueValues = [...new Set(data.map((tarifa) => tarifa[key]))];
  uniqueValues.sort();
  return uniqueValues;
};

class Filter {
  constructor(filters) {
    this.filters = [];
    this.addMany(filters);
  }

  getState() {
    const state = {};
    this.filters.forEach((filter) => {
      state[filter.key] = filter.value;
    });
    return state;
  }

  add(filter) {
    filter.otherFilters = () => {
      const otherFilters = this.filters.filter(
        (otherFilter) => otherFilter.key !== filter.key
      );
      return otherFilters;
    };
    filter.unfiltered = (data) => {
      return this.applyFilters(filter.otherFilters(), data);
    };
    filter.getAvailable = (data) => {
      const unfiltered = filter.unfiltered(data);
      const listaValores = getUniqueValues(unfiltered, filter.key);
      const val = [filter.default, ...listaValores];
      return val;
    };

    this.value = filter.default || "";
    this.filters.push(filter);
  }

  addMany(filters) {
    filters.forEach((filter) => {
      this.add(filter);
    });
  }

  applyAllFilters(data) {
    return this.applyFilters(this.filters, data);
  }

  applyFilters(filterList, data) {
    let filteredData = data;

    filterList.forEach((filter) => {
      filteredData = filteredData.filter(
        (item) =>
          item[filter.key] === filter.value || filter.value === filter.default
      );
    });

    return filteredData;
  }

  getCombinedFilters(data) {
    return this.filters.map((filter) => {
      return {
        key: filter.key,
        name: filter.name,
        value: filter.value,
        default: filter.default,
        available: filter.getAvailable(data),
      };
    });
  }
}

export default Filter;
