export const filterData = (data, filterBy, value) => {
  if (value === "all") {
    return data; // Devuelve todos los datos si el valor es "all"
  }
  return data.filter(item => {
    if (filterBy === "gender") {
      return item.facts[filterBy].includes(value); // Filtra por género
    }
    if (filterBy === "year") {
      return item.facts.year === parseInt(value); // Filtra por año
    }
    if (filterBy === "chapters") {
      return item.facts.chapters === parseInt(value); // Filtra por cápitulos
    }
    return false;
  });
};

export const sortData = (data, sortBy, sortOrder) => {
  const dataCopy = [...data];

  if (sortBy === 'averageChapters' || sortBy === 'mostCommonGenre' || sortBy === 'highestAudienceDorama') {
    // Ordenar por las estadísticas específicas
    if (sortBy === 'averageChapters') {
      dataCopy.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.facts.chapters - b.facts.chapters;
        } else {
          return b.facts.chapters - a.facts.chapters;
        }
      });
    } else if (sortBy === 'mostCommonGenre') {
      // Asumir que ordenar por género más común
      dataCopy.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.facts.gender.localeCompare(b.facts.gender);
        } else {
          return b.facts.gender.localeCompare(a.facts.gender);
        }
      });
    } else if (sortBy === 'highestAudienceDorama') {
      dataCopy.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.facts.audiencePercentage - b.facts.audiencePercentage;
        } else {
          return b.facts.audiencePercentage - a.facts.audiencePercentage;
        }
      });
    }
  } else {
    // Ordenar por otros campos
    dataCopy.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sortBy].localeCompare(b[sortBy]);
      } else {
        return b[sortBy].localeCompare(a[sortBy]);
      }
    });
  }
  return dataCopy;
}

export const computeStats = (data) => {
  // Calcular el promedio de capítulos
  const totalChapters = data.reduce((sum, item) => sum + item.facts.chapters, 0);
  const averageChapters = (totalChapters / data.length);
  const minValue = Math.floor(averageChapters);

  // Calcular el género más común
  const genreCount = {};
  data.forEach(item => {
    if (genreCount[item.facts.gender]) {
      genreCount[item.facts.gender]++;
    } else {
      genreCount[item.facts.gender] = 1;
    }
  });
  const mostCommonGenre = Object.keys(genreCount).reduce((a, b) => genreCount[a] > genreCount[b] ? a : b);

  // Encontrar el dorama con el mayor porcentaje de audiencia
  let highestAudienceDorama = data[0];
  data.forEach(item => {
    if (item.facts.audiencePercentage > highestAudienceDorama.facts.audiencePercentage) {
      highestAudienceDorama = item;
    }
  });

  return {
    minValue,
    mostCommonGenre,
    highestAudienceDorama
  };
};

export const metricsData = (data) => {
  const dataCopy = data.map((obj) => obj);
  return dataCopy.reduce((topObjects, currentObject) => {
    return [...topObjects, currentObject].sort(
      (a, b) =>
        parseFloat(b.facts["audiencePercentage"]) -
        parseFloat(a.facts["audiencePercentage"])
    ).slice(0, 3);
  }, []);
}
