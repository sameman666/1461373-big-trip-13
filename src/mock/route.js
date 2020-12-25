export const createRoute = (data) => {

  const allRenderedOffers = document.querySelectorAll(`.event__offer-price`);

  const countRenderedOffersSum = () => {
    let totalSum = 0;
    allRenderedOffers.forEach((element) => {
      totalSum = totalSum + element.textContent * 1;
    });
    return totalSum;
  };

  const price = data.reduce((a, b) => a + b.price, 0) + countRenderedOffersSum();
  let routePoints = {};

  const getUniqueCitiesAmount = () => {
    const cities = [];

    data.forEach((element) => cities.push(element.destination));

    const results = new Set(cities);

    return results.size;
  };

  if (getUniqueCitiesAmount() === 0) {
    routePoints = {
      route: ``,
      startEventDate: ``,
      endEventDate: ``,
      totalPrice: ``
    };
  } else if (getUniqueCitiesAmount() === 1) {
    routePoints = {
      route: data[0].destination,
      startEventDate: data[0].eventDate,
      endEventDate: data[0].eventDate.add(data[0].eventDuration, `m`),
      totalPrice: price
    };
  } else if (getUniqueCitiesAmount() === 2) {
    routePoints = {
      route: `${data[0].destination} - ${data[data.length - 1].destination}`,
      startEventDate: data[0].eventDate,
      endEventDate: data[1].eventDate.add(data[1].eventDuration, `m`),
      totalPrice: price
    };
  } else if (getUniqueCitiesAmount() === 3) {
    routePoints = {
      route: `${data[0].destination} - ${data[1].destination} - ${data[2].destination}`,
      startEventDate: data[0].eventDate,
      endEventDate: data[2].eventDate.add(data[2].eventDuration, `m`),
      totalPrice: price
    };
  } else if (getUniqueCitiesAmount() > 3) {
    routePoints = {
      route: `${data[0].destination} - ... - ${data[data.length - 1].destination}`,
      startEventDate: data[0].eventDate,
      endEventDate: data[data.length - 1].eventDate.add(data[data.length - 1].eventDuration, `m`),
      totalPrice: price
    };
  }

  return routePoints;
};
