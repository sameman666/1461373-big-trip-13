import RouteInfoAndPriceView, {createRoute} from "../view/route-info-and-price.js";
import SiteMenuView from "../view/site-menu.js";
import FiltersView from "../view/filters.js";
import SortingView from "../view/sorting.js";
import LoadingView from "../view/loading.js";
import EventsListView from "../view/events-list.js";
import NoPoints from "../view/no-points.js";
import {render, Place, remove} from "../utils/render.js";
import PointPresenter, {State as PointPresenterViewState} from "../presenter/point-presenter.js";
import PointNewPresenter from "../presenter/point-new.js";
import {filter} from "../utils/filters.js";
import {sortByPrice, sortByTime, sortByDay} from "../utils/point.js";
import {SortType, UserAction, UpdateType, MenuItem} from "../const.js";
import StatisticsView from "../view/statistics.js";

export default class TripPresenter {
  constructor(container, pointsModel, filterModel, newEventButton, api) {
    this._newEventButton = newEventButton;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._amountToRender = pointsModel.getPoints().length;
    this._defaultPointForCreateForm = pointsModel.getPoints()[0];
    this._container = container;
    this._points = pointsModel.getPoints();
    this._pointPresenter = {};
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;
    this._api = api;

    this._sorting = null;

    this._siteMenu = new SiteMenuView();
    this._filters = new FiltersView();
    this._eventsList = new EventsListView();
    this._noPoints = new NoPoints();
    this._routeInfoAndPrice = null;
    this._loadingComponent = new LoadingView();

    this._header = container.querySelector(`.page-header`);
    this._tripMain = this._header.querySelector(`.trip-main`);
    this._tripMainControls = this._header.querySelector(`.trip-main__trip-controls`);
    this._main = container.querySelector(`main`);
    this._pageBodyContainer = this._main.querySelector(`.page-body__container`);
    this._tripEvents = this._main.querySelector(`.trip-events`);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSiteMenuClick = this._handleSiteMenuClick.bind(this);

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    this._renderMenu();
    this._renderEventsList();
    this._createPointNewPresenter();
    this._renderLoading();
    this._renderPoints();
    this._renderStatistics();
    this._renderRouteInfoAndPrice();

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  destroy() {
    this._clearTrip({resetSortType: true});

    remove(this._eventsList);
    remove(this._sorting);
    remove(this._statistics);

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _renderMenu() {
    render(this._tripMainControls, this._siteMenu, Place.AFTER_BEGIN);
    this._siteMenu.setMenuClickHandler(this._handleSiteMenuClick);
  }

  _renderStatistics() {
    this._statistics = new StatisticsView(this._pointsModel);
    render(this._pageBodyContainer, this._statistics, Place.BEFORE_END);
    this._statistics.hide();
  }

  hide() {
    this._tripEvents.classList.add(`trip-events--hidden`);
  }

  show() {
    this._tripEvents.classList.remove(`trip-events--hidden`);
  }

  _handleSiteMenuClick(menuItem) {
    switch (menuItem) {
      case MenuItem.TABLE:
        this.destroy();
        this.init();
        this.show();
        this._statistics.hide();
        break;
      case MenuItem.STATS:
        this.destroy();
        this.init();
        this.hide();
        this._statistics.show();
        break;
    }
  }

  _renderSorting() {
    if (this._loadingComponent !== null) {
      remove(this._loadingComponent);
    }

    if (this._sorting !== null) {
      this._sorting = null;
    }

    this._sorting = new SortingView(this._currentSortType);

    render(this._tripEvents, this._sorting, Place.AFTER_BEGIN);
    this._sorting.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderEventsList() {
    render(this._tripEvents, this._eventsList, Place.BEFORE_END);
    this._tripEventsList = this._tripEvents.querySelector(`.trip-events__list`);
  }

  _createPointNewPresenter() {
    this._pointNewPresenter = new PointNewPresenter(this._tripEventsList, this._handleViewAction, this._newEventButton);
  }

  _renderLoading() {
    render(this._tripEventsList, this._loadingComponent, Place.BEFORE_END);
  }

  _renderPoints() {
    if (this._loadingComponent !== null) {
      remove(this._loadingComponent);
    }

    const points = this._getPoints();
    if (!points.length) {
      render(this._tripEventsList, this._noPoints, Place.BEFORE_END);
      return;
    }

    this._renderSorting();

    points.forEach((point) => {
      const pointPresenter = new PointPresenter(this._tripEventsList, this._handleViewAction, this._handleModeChange);
      pointPresenter.init(point, this._pointsModel.getOffers(), this._pointsModel.getDestinations());
      this._pointPresenter[point.id] = pointPresenter;
    });
  }

  _renderRouteInfoAndPrice() {
    if (this._routeInfoAndPrice !== null) {
      return;
    }
    if (this._points.length) {
      const createdRoute = createRoute(this._points);
      this._routeInfoAndPrice = new RouteInfoAndPriceView(createdRoute);
      render(this._tripMain, this._routeInfoAndPrice, Place.AFTER_BEGIN);
    }
  }

  createPoint() {
    this._handleModeChange();
    this._pointNewPresenter.init(Object.assign({}, this._defaultPointForCreateForm), this._pointsModel.getOffers(), this._pointsModel.getDestinations());
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filtredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.PRICE:
        return filtredPoints.sort(sortByPrice);
      case SortType.TIME:
        return filtredPoints.sort(sortByTime);
      case SortType.DEFAULT:
        return filtredPoints.sort(sortByDay);
    }
    return filtredPoints;
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTrip();
    this._currentSortType = sortType;
    this._renderPoints();
  }

  _clearTrip({resetSortType = false} = {}) {
    this._pointNewPresenter.destroy();
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
    if (this._sorting) {
      remove(this._sorting);
    }
    remove(this._noPoints);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update)
          .then((response) => {
            this._pointsModel.updatePoint(updateType, response);
          })
          .catch(() => {
            this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update)
          .then((response) => {
            this._pointsModel.addPoint(updateType, response);
          })
          .catch(() => {
            this._pointNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.deletePoint(updateType, update);
          })
          .catch(() => {
            this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderPoints();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderPoints();
        break;
      case UpdateType.INIT:
        remove(this._loadingComponent);
        this._clearTrip({resetSortType: true});
        this._renderPoints();
        break;
    }
  }
}
