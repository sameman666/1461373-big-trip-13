export const sortByPrice = (pointA, pointB) => {
  return pointB.price - pointA.price;
};

export const sortByTime = (pointA, pointB) => {
  return pointB.eventDuration - pointA.eventDuration;
};

export const sortByDay = (pointA, pointB) => {
  return pointA.eventDate - pointB.eventDate;
};
