export const createRoutePointTemplate = (point) => {
  const {type, date: {eventDate, eventDuration}, price, offers, destination, isFavourite} = point;
  const MINUTES_IN_AN_HOUR = 60;
  const HOURS_IN_A_DAY = 24;
  const MINUTES_IN_A_DAY = MINUTES_IN_AN_HOUR * HOURS_IN_A_DAY;
  const endEventDate = eventDate.add(eventDuration, `m`);
  const TIME_DIFFERENCE_IN_DAYS = endEventDate.diff(eventDate, `day`);
  const TIME_DIFFERENCE_IN_HOURS = endEventDate.diff(eventDate, `hour`);
  const TIME_DIFFERENCE_IN_MINUTES = endEventDate.diff(eventDate, `minute`);


  const renderEventDuration = () => {
    const eventDurationToRender = endEventDate.diff(eventDate, `minute`);

    if (eventDurationToRender >= MINUTES_IN_A_DAY) {
      return `${TIME_DIFFERENCE_IN_DAYS}D ${TIME_DIFFERENCE_IN_HOURS - TIME_DIFFERENCE_IN_DAYS * HOURS_IN_A_DAY}H ${TIME_DIFFERENCE_IN_MINUTES - TIME_DIFFERENCE_IN_HOURS * MINUTES_IN_AN_HOUR}M`;
    } else if (eventDurationToRender >= MINUTES_IN_AN_HOUR) {
      return `${TIME_DIFFERENCE_IN_HOURS}H ${TIME_DIFFERENCE_IN_MINUTES - TIME_DIFFERENCE_IN_HOURS * MINUTES_IN_AN_HOUR}M`;
    }
    return `${eventDurationToRender}M`;
  };

  const getRandomInteger = (a = 0, b = 1) => {
    const lower = Math.ceil(Math.min(a, b));
    const upper = Math.floor(Math.max(a, b));

    return Math.floor(lower + Math.random() * (upper - lower + 1));
  };

  const getRandomOffersForPoint = (offersToRender) => {
    const RandomOffers = [];
    const RANDOM_OFFERS_AMOUNT = getRandomInteger(1, offersToRender.length);
    if (offersToRender) {
      for (let i = 0; i < RANDOM_OFFERS_AMOUNT; i++) {
        RandomOffers.push(`<li class="event__offer">
        <span class="event__offer-title">${offersToRender[i].name}</span>
        +€&nbsp;
        <span class="event__offer-price">${offersToRender[i].price}</span>
      </li>`);
      }
    } else {
      RandomOffers.push(``);
    }
    return `<h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">${RandomOffers.join(``)}</ul>`;
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
    ${getRandomOffersForPoint(offers)}
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
