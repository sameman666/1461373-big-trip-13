export const createRoute = (data) => {
  let routePoints = {};

  let price = 0;

  for (let i = 0; i < data.length; i++) {
    price = price + data[i].price;
  }

  if (data.length <= 3) {
    routePoints = {
      firstPoint: data[0].destination,
      middlePoint: data[1].destination,
      lastPoint: data[data.length - 1].destination,
      startEventDate: data[0].date.eventDate,
      endEventDate: data[data.length - 1].date.eventDate,
      totalPrice: price
    };
  } else {
    routePoints = {
      firstPoint: data[0].destination,
      middlePoint: `...`,
      lastPoint: data[data.length - 1].destination,
      startEventDate: data[0].date.eventDate,
      endEventDate: data[data.length - 1].date.eventDate,
      totalPrice: price
    };
  }

  return routePoints;
};
