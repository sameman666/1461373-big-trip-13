import dayjs from "dayjs";

const DAYS_AMOUNT = 7;
const DECRIPTION_SENTENCES_AMOUNT = 5;
const MIN_EVENT_DURATION = 20;
const MAX_EVENT_DURATION = 40;
const MIN_EVENT_PRICE = 20;
const MAX_EVENT_PRICE = 100;

const point = {
  type: [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`],
  destination: [`Moscow`, `Saint-Petersburg`, `Petrozavodsk`],
  destinationInfo: [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`
  ],
};

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateRandomDate = () => {
  const randomIndex = getRandomInteger(1, DAYS_AMOUNT);
  return dayjs().add(randomIndex, `day`);
};

const generateData = (data) => {
  const randomIndex = getRandomInteger(0, data.length - 1);
  return data[randomIndex];
};

const getRandomDestinationInfo = () => {
  const randomAmountOfSentences = getRandomInteger(1, DECRIPTION_SENTENCES_AMOUNT);
  const splittedData = point.destinationInfo[0].split(`. `);
  let resultData = [];
  for (let i = 0; i < randomAmountOfSentences; i++) {
    resultData.push(splittedData[getRandomInteger(0, splittedData.length - 1)]);
  }

  resultData = resultData.join(`. `);
  return resultData;
};

const generateRandomPhoto = () => {
  const photo = `http://picsum.photos/248/152?r=${Math.random()}`;
  return photo;
};

export const createPoint = () => {
  const createdPoint = {
    type: generateData(point.type),
    destination: generateData(point.destination),
    date: {
      eventDate: generateRandomDate(),
      eventDuration: getRandomInteger(MIN_EVENT_DURATION, MAX_EVENT_DURATION)
    },
    price: getRandomInteger(MIN_EVENT_PRICE, MAX_EVENT_PRICE),
    isFavourite: Boolean(getRandomInteger()),
    offers: [
      {
        name: `luggage`,
        price: getRandomInteger(MIN_EVENT_PRICE, MAX_EVENT_PRICE),
      },
      {
        name: `comfort`,
        price: getRandomInteger(MIN_EVENT_PRICE, MAX_EVENT_PRICE),
      },
      {
        name: `meal`,
        price: getRandomInteger(MIN_EVENT_PRICE, MAX_EVENT_PRICE),
      },
      {
        name: `seats`,
        price: getRandomInteger(MIN_EVENT_PRICE, MAX_EVENT_PRICE),
      },
      {
        name: `train`,
        price: getRandomInteger(MIN_EVENT_PRICE, MAX_EVENT_PRICE),
      },
    ],
    destinationInfo: getRandomDestinationInfo(),
    photo: generateRandomPhoto()
  };

  return createdPoint;
};
