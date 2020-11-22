import {createSiteMenuTemplate} from "./view/menu.js";
import {createFiltersTemplate} from "./view/filters.js";
import {createSortingTemplate} from "./view/sorting.js";
import {createRoutePointTemplate} from "./view/route-point.js";
import {createEditorFormTemplate} from "./view/editor-form.js";
import {createEventsListTemplate} from "./view/create-events-list.js";
import {createPoint} from "./mock/point.js";
import {createRoute} from "./mock/route.js";
import {createRouteInfoAndPriceTemplate} from "./view/route-info.js";

const AMOUNT_TO_RENDER = 6;
const Place = {
  BEFORE_BEGIN: `beforebegin`,
  BEFORE_END: `beforeend`
};
const header = document.querySelector(`.page-header`);
const tripMainControls = header.querySelector(`.trip-main__trip-controls`);
const filterEventsHeading = tripMainControls.querySelector(`h2:last-child`);
const main = document.querySelector(`main`);
const tripEvents = main.querySelector(`.trip-events`);

const render = (container, template, place = Place.BEFORE_END) => {
  container.insertAdjacentHTML(place, template);
};

render(filterEventsHeading, createSiteMenuTemplate(), Place.BEFORE_BEGIN);
render(tripMainControls, createFiltersTemplate());
render(tripEvents, createSortingTemplate());
render(tripEvents, createEventsListTemplate());

const tripEventsList = tripEvents.querySelector(`.trip-events__list`);

let temporaryPoints = new Array(AMOUNT_TO_RENDER).fill().map(createPoint);

temporaryPoints = temporaryPoints.sort((a, b) => {
  return a.date.eventDate.format(`DD`) - b.date.eventDate.format(`DD`);
});

render(tripEventsList, createEditorFormTemplate(temporaryPoints[0]));

for (let i = 1; i < AMOUNT_TO_RENDER; i++) {
  render(tripEventsList, createRoutePointTemplate(temporaryPoints[i]));
}

const createdRoute = createRoute(temporaryPoints);

render(tripMainControls, createRouteInfoAndPriceTemplate(createdRoute), Place.BEFORE_BEGIN);
