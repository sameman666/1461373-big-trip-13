import {createPoint} from "./mock/point.js";
import TripPresenter from "./presenter/trip.js";
import FiltersPresenter from "./presenter/filter.js";
import PointsModel from "./model/points.js";
import FiltersModel from "./model/filter.js";

const AMOUNT_TO_RENDER = 10;

const body = document.querySelector(`body`);

const temporaryPoints = new Array(AMOUNT_TO_RENDER).fill().map(createPoint);
temporaryPoints.sort((a, b) => {
  return a.eventDate - b.eventDate;
});

const pointsModel = new PointsModel();
pointsModel.setPoints(temporaryPoints);

const tripMainControls = body.querySelector(`.trip-main__trip-controls`);

const filterModel = new FiltersModel();

const tripPresenter = new TripPresenter(body, temporaryPoints, pointsModel, filterModel);
tripPresenter.init();

const filtersPresenter = new FiltersPresenter(tripMainControls, filterModel, pointsModel);
filtersPresenter.init();

export const newEventButton = document.querySelector(`.trip-main__event-add-btn`);
newEventButton.addEventListener(`click`, (evt) => {
  newEventButton.disabled = true;
  evt.preventDefault();
  tripPresenter.createPoint();
});
