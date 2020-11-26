import {createEventList} from "../mock/point.js";
import {createCityList} from "../mock/point.js";

export const createEditorFormTemplate = (point) => {
  const {type, date: {eventDate, eventDuration}, price, offers, destination, destinationInfo, photo} = point;

  const getRandomInteger = (a = 0, b = 1) => {
    const lower = Math.ceil(Math.min(a, b));
    const upper = Math.floor(Math.max(a, b));

    return Math.floor(lower + Math.random() * (upper - lower + 1));
  };

  const getRandomOffersForEditorForm = (offersToRender) => {
    const RandomOffers = [];
    const RANDOM_OFFERS_AMOUNT = getRandomInteger(1, offersToRender.length);
    if (offersToRender) {
      for (let i = 0; i < RANDOM_OFFERS_AMOUNT; i++) {
        RandomOffers.push(`<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offersToRender[i].name}-1" type="checkbox" name="event-offer-${offersToRender[i].name}" checked="">
        <label class="event__offer-label" for="event-offer-${offersToRender[i].name}-1">
          <span class="event__offer-title">${offersToRender[i].name}</span>
          +€&nbsp;
          <span class="event__offer-price">${offersToRender[i].price}</span>
        </label>
      </div>`);
      }
    } else {
      RandomOffers.push(``);
    }
    if (RandomOffers[0] !== ``) {
      return `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${RandomOffers.join(``)}
      </div>
    </section>`;
    } else {
      return ``;
    }
  };

  return `<form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${createEventList()}
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
      <datalist id="destination-list-1">
        ${createCityList()}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${eventDate.format(`DD/MM/YY HH:mm`)}">
      —
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${eventDate.add(eventDuration, `m`).format(`DD/MM/YY HH:mm`)}">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        €
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>
  <section class="event__details">
      ${getRandomOffersForEditorForm(offers)}
     <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destinationInfo}</p>
      ${photo}
    </section>
  </section>
</form>`;
};
