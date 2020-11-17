import {createRouteInfoAndPriceTemplate} from "./view/route-info.js";
import {createSiteMenuTemplate} from "./view/menu.js";
import {createFiltersTemplate} from "./view/filters.js";
import {createSortingTemplate} from "./view/sorting.js";
import {createEditorFormTemplate} from "./view/editor-form.js";
import {createRoutePointTemplate} from "./view/route-point.js";
import {createCreateFormTemplate} from "./view/create-form.js";

const AMOUNT_TO_RENDER = 3;
const header = document.querySelector(`.page-header`);
const tripMainControls = header.querySelector(`.trip-main__trip-controls`);
const filterEventsHeading = tripMainControls.querySelector(`h2:last-child`);
const main = document.querySelector(`main`);
const tripEvents = main.querySelector(`.trip-events`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(tripMainControls, createRouteInfoAndPriceTemplate(), `beforebegin`);
render(filterEventsHeading, createSiteMenuTemplate(), `beforebegin`);
render(tripMainControls, createFiltersTemplate(), `beforeend`);
render(tripEvents, createSortingTemplate(), `beforeend`);

const newElement = document.createElement(`ul`);
newElement.className = `trip-events__list`;
const tripEventsList = newElement;
tripEvents.insertAdjacentElement(`beforeend`, tripEventsList);

render(tripEventsList, createEditorFormTemplate(), `beforeend`);

for (let i = 0; i < AMOUNT_TO_RENDER; i++) {
  render(tripEventsList, createRoutePointTemplate(), `beforeend`);
}

render(tripEventsList, createCreateFormTemplate(), `beforeend`);
