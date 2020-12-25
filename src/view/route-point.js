import AbstractView from "./abstract.js";

const MINUTES_IN_AN_HOUR = 60;
const HOURS_IN_A_DAY = 24;
const MINUTES_IN_A_DAY = MINUTES_IN_AN_HOUR * HOURS_IN_A_DAY;

const createRoutePointTemplate = (point) => {
  const {type, eventDate, endEventDate, price, checkedOffers, destination, isFavourite} = point;

  const timeDifferenceInDays = endEventDate.diff(eventDate, `day`);
  const timeDifferenceInHours = endEventDate.diff(eventDate, `hour`);
  const timeDifferenceInMinutes = endEventDate.diff(eventDate, `minute`);

  const renderEventDuration = () => {
    const eventDurationToRender = endEventDate.diff(eventDate, `minute`);

    if (eventDurationToRender >= MINUTES_IN_A_DAY) {
      return `${timeDifferenceInDays}D ${timeDifferenceInHours - timeDifferenceInDays * HOURS_IN_A_DAY}H ${timeDifferenceInMinutes - timeDifferenceInHours * MINUTES_IN_AN_HOUR}M`;
    } else if (eventDurationToRender >= MINUTES_IN_AN_HOUR) {
      return `${timeDifferenceInHours}H ${timeDifferenceInMinutes - timeDifferenceInHours * MINUTES_IN_AN_HOUR}M`;
    }
    return `${eventDurationToRender}M`;
  };

  const generateOffersListMarkup = (offersToRender) => {
    const offersListMarkups = [];
    if (offersToRender.length) {
      for (let i = 0; i < offersToRender.length; i++) {
        offersListMarkups.push(`<li class="event__offer">
        <span class="event__offer-title">${offersToRender[i].name}</span>
        +€&nbsp;
        <span class="event__offer-price">${offersToRender[i].price}</span>
      </li>`);
      }
    }
    return `<h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">${offersListMarkups.join(``)}</ul>`;
  };

  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${eventDate.format(`YYYY-MM-DD`)}">${eventDate.format(`MMM DD`).toUpperCase()}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${destination}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${eventDate.format(`YYYY-MM-DDTHH:mm`)}">${eventDate.format(`HH:mm`)}</time>
        —
        <time class="event__end-time" datetime="${eventDate.format(`YYYY-MM-DDTHH:mm`)}">${endEventDate.format(`HH:mm`)}</time>
      </p>
      <p class="event__duration">${renderEventDuration()}</p>
    </div>
    <p class="event__price">
      €&nbsp;<span class="event__price-value">${price}</span>
    </p>
    ${generateOffersListMarkup(checkedOffers)}
    <button class="event__favorite-btn event__favorite-btn${isFavourite ? `--active` : ``}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
};

export default class RoutePoint extends AbstractView {
  constructor(point) {
    super();
    this._point = point;
    this._clickHandler = this._clickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createRoutePointTemplate(this._point);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _clickHandler() {
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._clickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteClickHandler);
  }
}
