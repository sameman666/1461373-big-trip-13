import {createPoint} from "./mock/point.js";
import TripPresenter from "./presenter/trip.js";

const AMOUNT_TO_RENDER = 10;

const body = document.querySelector(`body`);

const temporaryPoints = new Array(AMOUNT_TO_RENDER).fill().map(createPoint);
temporaryPoints.sort((a, b) => {
  return a.date.eventDate - b.date.eventDate;
});

const tripPresenter = new TripPresenter(body, temporaryPoints);
tripPresenter.init();
