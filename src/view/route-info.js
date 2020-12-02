import {createElement} from "../utils.js";

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

export default class RouteInfoAndPrice {
  constructor(createdRoute) {
    this._createdRoute = createdRoute;

    this._element = null;
  }

  getTemplate() {
    return createRouteInfoAndPriceTemplate(this._createdRoute);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
