import TripPresenter from "./presenter/trip.js";
import FiltersPresenter from "./presenter/filter.js";
import PointsModel from "./model/points.js";
import FiltersModel from "./model/filter.js";
import Api from "./api.js";
import {UpdateType} from "./const.js";

const AUTHORIZATION = `Basic kuy784kf7859sdf324z`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip/`;

const body = document.querySelector(`body`);
const tripMainControls = body.querySelector(`.trip-main__trip-controls`);
const newEventButton = body.querySelector(`.trip-main__event-add-btn`);

const initApp = () => {
  const tripPresenter = new TripPresenter(body, pointsModel, filterModel, newEventButton, api);
  tripPresenter.init();

  const filtersPresenter = new FiltersPresenter(tripMainControls, filterModel, pointsModel);
  filtersPresenter.init();

  newEventButton.addEventListener(`click`, (evt) => {
    newEventButton.disabled = true;
    evt.preventDefault();
    tripPresenter.createPoint();
  });
};

const pointsModel = new PointsModel();
const filterModel = new FiltersModel();
const api = new Api(END_POINT, AUTHORIZATION);

Promise.all([
  api.getPoints(),
  api.getOffers(),
  api.getDestinations()
])
.then(([points, offers, destinations]) => {
  pointsModel.setPoints(UpdateType.INIT, points);
  pointsModel.setAllOffers(offers);
  pointsModel.setDestinations(destinations);
  initApp();
})
.catch(() => {
  pointsModel.setPoints(UpdateType.INIT, []);
  initApp();
});
