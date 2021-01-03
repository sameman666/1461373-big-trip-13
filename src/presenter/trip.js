import RouteInfoAndPriceView from "../view/route-info.js";
import SiteMenuView from "../view/menu.js";
import FiltersView from "../view/filters.js";
import SortingView from "../view/sorting.js";
import EventsListView from "../view/create-events-list.js";
import NoPoints from "../view/no-points.js";
import {render, Place, remove} from "../utils/render.js";
import {createRoute} from "../mock/route.js";
import PointPresenter from "../presenter/point.js";
import PointNewPresenter from "../presenter/pointNewPresenter.js";
import {filter} from "../utils/filters.js";
import {sortByPrice, sortByTime, sortByDay} from "../utils/point.js";
import {SortType, UserAction, UpdateType, FilterType} from "../const.js";

export default class TripPresenter {
  constructor(container, points, pointsModel, filterModel) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._amountToRender = points.length;
    this._container = container;
    this._points = points;
    this._pointPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._sorting = null;

    this._siteMenu = new SiteMenuView();
    this._filters = new FiltersView();
    this._eventsList = new EventsListView();
    this._noPoints = new NoPoints();
    this._routeInfoAndPrice = new RouteInfoAndPriceView();

    this._header = container.querySelector(`.page-header`);
    this._tripMain = this._header.querySelector(`.trip-main`);
    this._tripMainControls = this._header.querySelector(`.trip-main__trip-controls`);
    this._main = container.querySelector(`main`);
    this._tripEvents = this._main.querySelector(`.trip-events`);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderMenu();
    this._renderEventsList();
    this._createPointNewPresenter();
    this._renderPoints();
    this._renderRouteInfoAndPrice();
  }

  _renderMenu() {
    render(this._tripMainControls, new SiteMenuView(), Place.AFTER_BEGIN);
  }

  _renderSorting() {
    if (this._sorting !== null) {
      this._sorting = null;
    }

    this._sorting = new SortingView(this._currentSortType);

    render(this._tripEvents, this._sorting, Place.AFTER_BEGIN);
    this._sorting.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderEventsList() {
    render(this._tripEvents, new EventsListView(), Place.BEFORE_END);
    this._tripEventsList = this._tripEvents.querySelector(`.trip-events__list`);
  }

  _createPointNewPresenter() {
    this._pointNewPresenter = new PointNewPresenter(this._tripEventsList, this._handleViewAction);
  }

  _renderPoints() {
    const points = this._getPoints();
    if (!points.length) {
      render(this._tripEventsList, new NoPoints(), Place.BEFORE_END);
      return;
    }

    this._renderSorting();

    points.forEach((point) => {
      const pointPresenter = new PointPresenter(this._tripEventsList, this._handleViewAction, this._handleModeChange);
      pointPresenter.init(point);
      this._pointPresenter[point.id] = pointPresenter;
    });
  }

  _renderRouteInfoAndPrice() {
    if (this._points.length) {
      const createdRoute = createRoute(this._points);
      render(this._tripMain, new RouteInfoAndPriceView(createdRoute), Place.AFTER_BEGIN);
    }
  }

  createPoint() {
    const defaultData = this._getPoints()[0];
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init(Object.assign({}, defaultData));
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
    remove(this._sorting);
    remove(this._noPoints);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }
  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
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
    }
  }
}
