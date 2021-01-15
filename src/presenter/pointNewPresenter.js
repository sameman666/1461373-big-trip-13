import CreateFormView from "../view/create-form.js";
import {generateId} from "../utils/point.js";
import {remove, render, Place} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";

export default class PointNew {
  constructor(pointListContainer, changeData, newEventButton) {
    this._newEventButton = newEventButton;
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;

    this._pointCreateComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCancelClick = this._handleCancelClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point, offers, destinations) {
    if (this._pointCreateComponent !== null) {
      return;
    }

    this._pointCreateComponent = new CreateFormView(point, offers, destinations);
    this._pointCreateComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointCreateComponent.setCancelClickHandler(this._handleCancelClick);

    render(this._pointListContainer, this._pointCreateComponent, Place.AFTER_BEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointCreateComponent === null) {
      return;
    }

    remove(this._pointCreateComponent);
    this._pointCreateComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._newEventButton.disabled = false;
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        Object.assign(point, {id: generateId()})
    );
    this.destroy();
    this._newEventButton.disabled = false;
  }

  _handleCancelClick() {
    this.destroy();
    this._newEventButton.disabled = false;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
      this._newEventButton.disabled = false;
    }
  }
}
