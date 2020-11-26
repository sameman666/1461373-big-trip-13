export const createRoute = (data, offersSum) => {

  let price = data.reduce((a, b) => a + b.price, 0) + offersSum;
  let routePoints = {};

  const getUniqueCitiesAmount = () => {
    const cities = [];

    data.forEach((element) => cities.push(element.destination));

    const result = [];

    cities.forEach((element) => {
      if (!result.includes(element)) {
        result.push(element);
      }
    });

    return result.length;
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
      startEventDate: data[0].date.eventDate,
      endEventDate: data[0].date.eventDate.add(data[0].date.eventDuration, `m`),
      totalPrice: price
    };
  } else if (getUniqueCitiesAmount() === 2) {
    routePoints = {
      route: `${data[0].destination} - ${data[data.length - 1].destination}`,
      startEventDate: data[0].date.eventDate,
      endEventDate: data[1].date.eventDate.add(data[1].date.eventDuration, `m`),
      totalPrice: price
    };
  } else if (getUniqueCitiesAmount() === 3) {
    routePoints = {
      route: `${data[0].destination} - ${data[1].destination} - ${data[2].destination}`,
      startEventDate: data[0].date.eventDate,
      endEventDate: data[2].date.eventDate.add(data[2].date.eventDuration, `m`),
      totalPrice: price
    };
  } else if (getUniqueCitiesAmount() > 3) {
    routePoints = {
      route: `${data[0].destination} - ... - ${data[data.length - 1].destination}`,
      startEventDate: data[0].date.eventDate,
      endEventDate: data[data.length - 1].date.eventDate.add(data[data.length - 1].date.eventDuration, `m`),
      totalPrice: price
    };
  }

  return routePoints;
};
