import AbstractView from "./abstract.js";

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
      endEventDate: data[0].endEventDate,
      totalPrice: price
    };
  } else if (getUniqueCitiesAmount() === 2) {
    routePoints = {
      route: `${data[0].destination} - ${data[data.length - 1].destination}`,
      startEventDate: data[0].eventDate,
      endEventDate: data[1].endEventDate,
      totalPrice: price
    };
  } else if (getUniqueCitiesAmount() === 3) {
    routePoints = {
      route: `${data[0].destination} - ${data[1].destination} - ${data[2].destination}`,
      startEventDate: data[0].eventDate,
      endEventDate: data[2].endEventDate,
      totalPrice: price
    };
  } else if (getUniqueCitiesAmount() > 3) {
    routePoints = {
      route: `${data[0].destination} - ... - ${data[data.length - 1].destination}`,
      startEventDate: data[0].eventDate,
      endEventDate: data[data.length - 1].endEventDate,
      totalPrice: price
    };
  }

  return routePoints;
};


const createRouteInfoAndPriceTemplate = (createdRoute) => {
  const {startEventDate, endEventDate, totalPrice, route} = createdRoute;
  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${route}</h1>

    <p class="trip-info__dates">${startEventDate.format(`MMM DD`)}&nbsp;—&nbsp;${endEventDate.format(`DD`)}</p>
  </div>

  <p class="trip-info__cost">
    Total: €&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
  </p>
</section>`;
};

export default class RouteInfoAndPrice extends AbstractView {
  constructor(createdRoute) {
    super();
    this._createdRoute = createdRoute;
  }

  getTemplate() {
    return createRouteInfoAndPriceTemplate(this._createdRoute);
  }
}
