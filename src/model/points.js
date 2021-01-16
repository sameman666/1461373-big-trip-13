import Observer from "../utils/observer.js";
import dayjs from "dayjs";

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(updateType, points) {
    this._points = points.slice();

    this._notify(updateType);
  }

  setAllOffers(offers) {
    this._offers = offers.slice();
  }

  setDestinations(destinations) {
    this._destinations = destinations.slice();
  }

  getPoints() {
    return this._points;
  }

  getOffers() {
    return this._offers;
  }

  getDestinations() {
    return this._destinations;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptPointToClient(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          eventDate: dayjs(new Date(point.date_from)),
          endEventDate: dayjs(new Date(point.date_to)),
          eventDuration: dayjs(new Date(point.date_to)).diff(dayjs(new Date(point.date_from))),
          isFavourite: point.is_favorite,
          price: point.base_price,
          destination: point.destination.name,
          destinationInfo: point.destination.description,
          photo: point.destination.pictures.map((picture) => {
            return {
              src: picture.src,
              description: picture.description
            };
          }),
          checkedOffers: point.offers.map((offer) => {
            return Object.assign(
                {},
                offer,
                {
                  name: offer.title,
                  price: offer.price
                }
            );
          }),
        }
    );
    adaptedPoint.checkedOffers.forEach((checkedOffer) => {
      delete checkedOffer.title;
    });

    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;
    delete adaptedPoint.base_price;
    delete adaptedPoint.destination.name;
    delete adaptedPoint.destination.description;
    delete adaptedPoint.destination.picures;
    delete adaptedPoint.offers;

    return adaptedPoint;
  }

  static adaptPointToServer(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          "date_from": point.eventDate.toISOString(),
          "date_to": point.endEventDate.toISOString(),
          "is_favorite": point.isFavourite,
          "base_price": Number(point.price),
          "destination": {
            "name": point.destination,
            "description": point.destinationInfo,
            "pictures": point.photo
          },
          "offers": point.checkedOffers.map((checkedOffer) => {
            return Object.assign(
                {},
                checkedOffer,
                {
                  title: checkedOffer.name,
                  price: checkedOffer.price
                }
            );
          }),
        }
    );

    adaptedPoint.offers.forEach((offer) => {
      delete offer.name;
    });

    delete adaptedPoint.eventDate;
    delete adaptedPoint.endEventDate;
    delete adaptedPoint.eventDuration;
    delete adaptedPoint.isFavourite;
    delete adaptedPoint.price;
    delete adaptedPoint.destinationInfo;
    delete adaptedPoint.photo;
    delete adaptedPoint.checkedOffers;


    return adaptedPoint;
  }
}
