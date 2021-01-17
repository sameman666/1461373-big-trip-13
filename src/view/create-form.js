import {generatePhotosMarkup, generateEventListMarkup, generateCityListMarkup, generateOffersListMarkup, createCityList, createEventList} from "../view/editor-form.js";
import SmartView from "./smart.js";
import flatpickr from "flatpickr";
import dayjs from "dayjs";

const createNewEventFormTemplate = (point, offers, destinations) => {
  const {type, eventDate, eventDuration, price, checkedOffers, destination, destinationInfo, photo, isDisabled, isSaving} = point;

  return `<form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? `disabled` : ``}>

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${generateEventListMarkup(createEventList(offers), isDisabled)}
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1" ${isDisabled ? `disabled` : ``}>
      <datalist id="destination-list-1">
        ${generateCityListMarkup(createCityList(destinations))}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${eventDate.format(`DD/MM/YY HH:mm`)}" ${isDisabled ? `disabled` : ``}>
      —
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${eventDate.add(eventDuration, `m`).format(`DD/MM/YY HH:mm`)}" ${isDisabled ? `disabled` : ``}>
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        €
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}" ${isDisabled ? `disabled` : ``}>
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? `disabled` : ``}>${isSaving ? `Saving` : `Save`}</button>
    <button class="event__reset-btn" type="reset" ${isDisabled ? `disabled` : ``}>Cancel</button>
  </header>
  <section class="event__details">
    ${generateOffersListMarkup(checkedOffers, type, offers, isDisabled)}
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destinationInfo}</p>
      ${generatePhotosMarkup(photo)}
    </section>
  </section>
</form>`;
};

export default class CreateForm extends SmartView {
  constructor(point, offers, destinations) {
    super();
    this._data = CreateForm.parsePointToData(point);
    this._offers = offers;
    this._destinations = destinations;
    this._startDatepicker = null;
    this._endDatepicker = null;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formCancelClickHandler = this._formCancelClickHandler.bind(this);

    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._eventTypeToggleHandler = this._eventTypeToggleHandler.bind(this);
    this._destinationInputHandler = this._destinationInputHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._offersCheckboxHandler = this._offersCheckboxHandler.bind(this);

    this._setDatepicker();
    this._setInnerHandlers();
  }

  removeElement() {
    super.removeElement();

    if (this._startDatepicker || this._endDatepicker) {
      this._startDatepicker.destroy();
      this._endDatepicker.destroy();
      this._startDatepicker = null;
      this._endDatepicker = null;
    }
  }

  reset(point) {
    this.updateData(
        CreateForm.parsePointToData(point)
    );
  }

  getTemplate() {
    return createNewEventFormTemplate(this._data, this._offers, this._destinations);
  }

  _setDatepicker() {
    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startdatepicker = null;
    }

    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }

    this._startDatepicker = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          enableTime: true,
          minDate: `today`,
          dateFormat: `d/m/y H:i`,
          defaultDate: this._data.eventDate.toDate(),
          onChange: this._startDateChangeHandler
        }
    );

    this._endDatepicker = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          enableTime: true,
          minDate: this._data.eventDate.toDate(),
          dateFormat: `d/m/y H:i`,
          defaultDate: this._data.endEventDate.toDate(),
          onChange: this._endDateChangeHandler
        }
    );
  }

  _startDateChangeHandler(userDate) {
    this.updateData({
      eventDate: dayjs(userDate),
    });
    this.updateData({
      eventDuration: this._data.endEventDate.diff(this._data.eventDate)
    });
  }

  _endDateChangeHandler([userDate]) {
    this.updateData({
      endEventDate: dayjs(userDate)
    });
    this.updateData({
      eventDuration: this._data.endEventDate.diff(this._data.eventDate)
    });
  }

  _setInnerHandlers() {
    this.getElement()
    .querySelector(`.event__type-list`)
    .addEventListener(`click`, this._eventTypeToggleHandler);
    this.getElement()
    .querySelector(`.event__input--destination`)
    .addEventListener(`input`, this._destinationInputHandler);
    this.getElement()
    .querySelector(`.event__input--price`)
    .addEventListener(`input`, this._priceInputHandler);
    this.getElement()
    .addEventListener(`change`, this._offersCheckboxHandler);
  }

  _eventTypeToggleHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName === `LABEL`) {
      this.updateData({
        type: evt.target.textContent
      });
      const foundType = this._offers.find((offer) => offer.type.toLowerCase() === this._data.type.toLowerCase());
      this.updateData({
        checkedOffers: foundType.offers.length ?
          foundType.offers.map((offer) => {
            return {
              name: offer.title,
              price: offer.price
            };
          }) : []
      });
    }
  }

  _destinationInputHandler(evt) {
    evt.preventDefault();
    const foundDestination = this._destinations.find((destination) => destination.name === evt.target.value);
    if (foundDestination) {
      this.updateData({
        destination: foundDestination.name,
        destinationInfo: foundDestination.description,
        photo: foundDestination.pictures
      });
    } else {
      evt.target.setCustomValidity(`Выберите из списка возможных городов`);
    }
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: evt.target.value
    });
  }

  _offersCheckboxHandler(evt) {
    evt.preventDefault();
    if (evt.target.parentElement.className === `event__offer-selector`) {
      const offerElement = evt.target.parentElement;
      const offerName = offerElement.querySelector(`.event__offer-title`).textContent;
      const offerPrice = offerElement.querySelector(`.event__offer-price`).textContent;
      if (!this._data.checkedOffers.find((offer) => offer.name === offerName)) {
        this._data.checkedOffers.push(
            {
              name: offerName,
              price: offerPrice
            }
        );
      } else {
        const offerIndex = this._data.checkedOffers.findIndex((offer) => offer.name === offerName);
        this._data.checkedOffers.splice(offerIndex, 1);
      }
    }
  }

  restoreHandlers() {
    this._setDatepicker();
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCancelClickHandler(this._callback.cancelClick);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(CreateForm.parseDataToPoint(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  _formCancelClickHandler(evt) {
    evt.preventDefault();
    this._callback.cancelClick(CreateForm.parseDataToPoint(this._data));
  }

  setCancelClickHandler(callback) {
    this._callback.cancelClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formCancelClickHandler);
  }

  static parsePointToData(point) {
    return Object.assign(
        {},
        point,
        {
          isDisabled: false,
          isSaving: false,
        }
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    delete data.isDisabled;
    delete data.isSaving;

    return data;
  }
}
