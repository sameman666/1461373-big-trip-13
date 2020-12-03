import {createCityList, createEventList} from "../mock/point.js";
import {createElement} from "../utils.js";

export const generatePhotosMarkup = (photos) => {
  const photosMarkups = [];
  for (let i = 0; i < photos.length; i++) {
    photosMarkups.push(`<img class="event__photo" src="${photos[i]}" alt="Event photo">`);
  }
  return `<div class="event__photos-container">
  <div class="event__photos-tape">
    ${photosMarkups.join(``)}
  </div>
</div>`;
};

export const generateEventListMarkup = (createdEventList) => {
  const eventListMarkups = [];
  for (let i = 0; i < createdEventList.length; i++) {
    eventListMarkups.push(`<div class="event__type-item">
      <input id="event-type-${createdEventList[i].toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${createdEventList[i].toLowerCase()}">
      <label class="event__type-label  event__type-label--${createdEventList[i].toLowerCase()}" for="event-type-${createdEventList[i].toLowerCase()}-1">${createdEventList[i]}</label>
    </div>`);
  }
  return eventListMarkups.join(``);
};

export const generateCityListMarkup = (createdCityList) => {
  const cityListMarkups = [];
  for (let i = 0; i < createdCityList.length; i++) {
    cityListMarkups.push(`<option value="${createdCityList[i]}"></option>`);
  }
  return cityListMarkups.join(``);
};

export const generateOffersListMarkup = (offersToRender) => {
  const offersListMarkups = [];
  if (offersToRender.length) {
    for (let i = 0; i < offersToRender.length; i++) {
      offersListMarkups.push(`<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offersToRender[i].name}-1" type="checkbox" name="event-offer-${offersToRender[i].name}" checked="">
      <label class="event__offer-label" for="event-offer-${offersToRender[i].name}-1">
        <span class="event__offer-title">${offersToRender[i].name}</span>
        +€&nbsp;
        <span class="event__offer-price">${offersToRender[i].price}</span>
      </label>
    </div>`);
    }
    return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${offersListMarkups.join(``)}
    </div>
  </section>`;
  }
  return offersListMarkups;
};

const createEditorFormTemplate = (point) => {
  const {type, date: {eventDate, eventDuration}, price, checkedOffers, destination, destinationInfo, photo} = point;

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
          ${generateEventListMarkup(createEventList())}
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
      <datalist id="destination-list-1">
        ${generateCityListMarkup(createCityList())}
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
      ${generateOffersListMarkup(checkedOffers)}
     <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destinationInfo}</p>
      ${generatePhotosMarkup(photo)}
    </section>
  </section>
</form>`;
};

export default class EditorForm {
  constructor(point) {
    this._point = point;

    this._element = null;
  }

  getTemplate() {
    return createEditorFormTemplate(this._point);
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
