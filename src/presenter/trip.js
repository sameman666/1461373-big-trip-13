import RouteInfoAndPriceView from "../view/route-info.js";
import SiteMenuView from "../view/menu.js";
import FiltersView from "../view/filters.js";
import SortingView from "../view/sorting.js";
import EventsListView from "../view/create-events-list.js";
import NoPoints from "../view/no-points.js";
import {renderElement, Place} from "../utils/render.js";
import {createRoute} from "../mock/route.js";
import PointPresenter from "../presenter/point.js";
import {updateItem} from "../utils/common.js";

export default class TripPresenter {
  constructor(container, points) {
    this._AMOUNT_TO_RENDER = points.length;
    this._container = container;
    this._points = points;
    this._pointPresenter = {};

    this._siteMenu = new SiteMenuView();
    this._filters = new FiltersView();
    this._sorting = new SortingView();
    this._eventsList = new EventsListView();
    this._noPoints = new NoPoints();
    this._routeInfoAndPrice = new RouteInfoAndPriceView();

    this._header = container.querySelector(`.page-header`);
    this._tripMain = this._header.querySelector(`.trip-main`);
    this._tripMainControls = this._header.querySelector(`.trip-main__trip-controls`);
    this._main = container.querySelector(`main`);
    this._tripEvents = this._main.querySelector(`.trip-events`);

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init() {
    this._renderMenu();
    this._renderFilters();
    this._renderSorting();
    this._renderEventsList();
    this._renderPoints();
    this._renderNoPoints();
    this._renderRouteInfoAndPrice();
  }

  _handleModeChange() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _renderMenu() {
    renderElement(this._tripMainControls, new SiteMenuView(), Place.AFTER_BEGIN);
  }

  _renderFilters() {
    renderElement(this._tripMainControls, new FiltersView(), Place.BEFORE_END);
  }

  _handlePointChange(updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }

  _renderSorting() {
    renderElement(this._tripEvents, new SortingView(), Place.BEFORE_END);
  }

  _renderEventsList() {
    renderElement(this._tripEvents, new EventsListView(), Place.BEFORE_END);
    this.tripEventsList = this._tripEvents.querySelector(`.trip-events__list`);
  }

  _renderPoints() {
    for (let i = 0; i < this._AMOUNT_TO_RENDER; i++) {
      const pointPresenter = new PointPresenter(this.tripEventsList, this._handlePointChange, this._handleModeChange);
      pointPresenter.init(this._points[i]);
      this._pointPresenter[this._points[i].id] = pointPresenter;
    }
  }

  _renderNoPoints() {
    if (!this._points.length) {
      renderElement(this._tripEventsList, new NoPoints(), Place.BEFORE_END);
    }
  }

  _renderRouteInfoAndPrice() {
    if (this._points.length) {
      const createdRoute = createRoute(this._points);
      renderElement(this._tripMain, new RouteInfoAndPriceView(createdRoute), Place.AFTER_BEGIN);
    }
  }
}
