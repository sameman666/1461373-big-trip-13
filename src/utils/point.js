export const sortByPrice = (pointA, pointB) => {
  return pointB.price - pointA.price;
};

export const sortByTime = (pointA, pointB) => {
  return pointB.date.eventDuration - pointA.date.eventDuration;
};
