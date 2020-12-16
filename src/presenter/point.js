import RoutePointView from "../view/route-point.js";
import EditorFormView from "../view/editor-form.js";
import {renderElement, Place, replace, remove} from "../utils/render.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class PointPresenter {
  constructor(container, changeData, changeMode) {
    this._container = container;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._routePointComponent = null;
    this._routePointEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleClick = this._handleClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point) {
    this._point = point;

    const prevRoutePointComponent = this._routePointComponent;
    const prevRoutePointEditComponent = this._routePointEditComponent;

    this._routePointComponent = new RoutePointView(point);
    this._routePointEditComponent = new EditorFormView(point);

    this._routePointComponent.setClickHandler(this._handleClick);
    this._routePointEditComponent.setEditClickHandler(this._handleEditClick);
    this._routePointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._routePointEditComponent.setFormSubmitHandler(this._handleFormSubmit);

    if (prevRoutePointComponent === null || prevRoutePointEditComponent === null) {
      renderElement(this._container, this._routePointComponent, Place.BEFORE_END);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._routePointComponent, prevRoutePointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._routePointEditComponent, prevRoutePointEditComponent);
    }

    remove(prevRoutePointComponent);
    remove(prevRoutePointEditComponent);
  }

  destroy() {
    remove(this._routePointComponent);
    remove(this._routePointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditorToRoutePoint();
    }
  }

  _replaceRoutePointToEditor() {
    this._container.replaceChild(this._routePointEditComponent.getElement(), this._routePointComponent.getElement());
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceEditorToRoutePoint() {
    this._container.replaceChild(this._routePointComponent.getElement(), this._routePointEditComponent.getElement());
    this._mode = Mode.DEFAULT;
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._replaceEditorToRoutePoint();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }

  _handleClick() {
    this._replaceRoutePointToEditor();
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleEditClick() {
    this._replaceEditorToRoutePoint();
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFavoriteClick() {
    this._changeData(
        Object.assign(
            {},
            this._point,
            {
              isFavourite: !this._point.isFavourite
            }
        )
    );
  }

  _handleFormSubmit(point) {
    this._changeData(point);
    this._replaceEditorToRoutePoint();
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }
}
