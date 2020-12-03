import {renderElement, Place} from "./utils.js";
import SiteMenuView from "./view/menu.js";
import FiltersView from "./view/filters.js";
import SortingView from "./view/sorting.js";
import {createPoint} from "./mock/point.js";
import RoutePointView from "./view/route-point.js";
import NoPoints from "./view/no-points.js";
import EditorFormView from "./view/editor-form.js";
import EventsListView from "./view/create-events-list.js";
import {createRoute} from "./mock/route.js";
import RouteInfoAndPriceView from "./view/route-info.js";

const AMOUNT_TO_RENDER = 12;

const header = document.querySelector(`.page-header`);
const tripMain = header.querySelector(`.trip-main`);
const tripMainControls = header.querySelector(`.trip-main__trip-controls`);
const main = document.querySelector(`main`);
const tripEvents = main.querySelector(`.trip-events`);

renderElement(tripMainControls, new SiteMenuView().getElement(), Place.AFTER_BEGIN);
renderElement(tripMainControls, new FiltersView().getElement(), Place.BEFORE_END);
renderElement(tripEvents, new SortingView().getElement(), Place.BEFORE_END);
renderElement(tripEvents, new EventsListView().getElement(), Place.BEFORE_END);

const temporaryPoints = new Array(AMOUNT_TO_RENDER).fill().map(createPoint);

temporaryPoints.sort((a, b) => {
  return a.date.eventDate - b.date.eventDate;
});

const tripEventsList = tripEvents.querySelector(`.trip-events__list`);

const renderPoint = (eventsList, point) => {
  const routePointComponent = new RoutePointView(point);
  const routePointEditComponent = new EditorFormView(point);

  const replaceRoutePointToEditor = () => {
    eventsList.replaceChild(routePointEditComponent.getElement(), routePointComponent.getElement());
  };

  const replaceEditorToRoutePoint = () => {
    eventsList.replaceChild(routePointComponent.getElement(), routePointEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceEditorToRoutePoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  routePointComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceRoutePointToEditor();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  routePointEditComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceEditorToRoutePoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  routePointEditComponent.getElement().addEventListener(`submit`, (evt) => {
    replaceEditorToRoutePoint();
    evt.preventDefault();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  return renderElement(eventsList, routePointComponent.getElement(), Place.BEFORE_END);
};

if (!temporaryPoints.length) {
  renderElement(tripEventsList, new NoPoints().getElement(), Place.BEFORE_END);
}

for (let i = 0; i < AMOUNT_TO_RENDER; i++) {
  renderPoint(tripEventsList, temporaryPoints[i]);
}

const createdRoute = createRoute(temporaryPoints);

renderElement(tripMain, new RouteInfoAndPriceView(createdRoute).getElement(), Place.AFTER_BEGIN);
