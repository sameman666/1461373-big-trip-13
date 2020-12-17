import dayjs from "dayjs";
import {getRandomInteger} from "../utils/common.js";

const DAYS_AMOUNT = 7;
const DECRIPTION_SENTENCES_AMOUNT = 5;
const MIN_EVENT_DURATION_MINUTES = 20;
const MAX_EVENT_DURATION_MINUTES = 40;
const MIN_EVENT_PRICE = 20;
const MAX_EVENT_PRICE = 100;
const DESCRIPTION = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`];


const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const getRandomDestinationInfo = () => {
  const randomAmountOfSentences = getRandomInteger(1, DECRIPTION_SENTENCES_AMOUNT);
  const splittedData = DESCRIPTION[0].split(`. `);
  let resultData = [];
  while (resultData.length < randomAmountOfSentences) {
    resultData.push(splittedData[getRandomInteger(0, splittedData.length - 1)]);
  }
  resultData = resultData.join(`. `);
  return resultData;
};

export const generateRandomPhotos = () => {
  const photos = [];
  const randomAmountOfPhotos = getRandomInteger(1, 5);
  while (photos.length < randomAmountOfPhotos) {
    const image = `http://picsum.photos/248/152?r=${Math.random()}`;
    photos.push(image);
  }
  return photos;
};

export const DESTINATIONS = [
  {
    destination: `Moscow`,
    destinationInfo: getRandomDestinationInfo(),
    destinationPhoto: generateRandomPhotos(),
  },
  {
    destination: `Saint-Petersburg`,
    destinationInfo: getRandomDestinationInfo(),
    destinationPhoto: generateRandomPhotos(),
  },
  {
    destination: `Petrozavodsk`,
    destinationInfo: getRandomDestinationInfo(),
    destinationPhoto: generateRandomPhotos(),
  }
];

export const types = [
  {
    name: `Taxi`,
    offers: [
      {
        name: `Add luggage`,
        price: getRandomInteger(MIN_EVENT_PRICE, MAX_EVENT_PRICE),
      },
      {
        name: `Switch to comfort`,
        price: getRandomInteger(MIN_EVENT_PRICE, MAX_EVENT_PRICE),
      },
      {
        name: `Business class`,
        price: getRandomInteger(MIN_EVENT_PRICE, MAX_EVENT_PRICE),
      }
    ]
  },
  {
    name: `Bus`,
    offers: [
      {
        name: `Add meal`,
        price: getRandomInteger(MIN_EVENT_PRICE, MAX_EVENT_PRICE),
      },
      {
        name: `Travel by train`,
        price: getRandomInteger(MIN_EVENT_PRICE, MAX_EVENT_PRICE),
      },
      {
        name: `Express Bus`,
        price: getRandomInteger(MIN_EVENT_PRICE, MAX_EVENT_PRICE),
      }
    ]
  },
  {
    name: `Train`,
    offers: [
      {
        name: `Choose seats`,
        price: getRandomInteger(MIN_EVENT_PRICE, MAX_EVENT_PRICE),
      },
      {
        name: `Order Uber`,
        price: getRandomInteger(MIN_EVENT_PRICE, MAX_EVENT_PRICE),
      },
      {
        name: `Drunk passengers`,
        price: getRandomInteger(MIN_EVENT_PRICE, MAX_EVENT_PRICE),
      }
    ]
  },
  {
    name: `Ship`,
  },
  {
    name: `Transport`,
  },
  {
    name: `Drive`,
  },
  {
    name: `Flight`,
  },
  {
    name: `Check-in`,
  },
  {
    name: `Sightseeing`,
  },
  {
    name: `Restaurant`,
  }
];

export const createEventList = () => {
  const eventList = types.map((element) => {
    return element.name;
  });
  return eventList;
};

export const createCityList = () => {
  const cityList = DESTINATIONS.map((element) => {
    return element.destination;
  });
  return cityList;
};

const generateRandomDate = () => {
  const randomIndex = getRandomInteger(1, DAYS_AMOUNT);
  return dayjs().add(randomIndex, `day`);
};

export const createPoint = () => {
  const randomDestinationIndex = getRandomInteger(0, DESTINATIONS.length - 1);
  const randomTypeIndex = getRandomInteger(0, types.length - 1);

  const createOffersforPoint = () => {
    const availableOffers = types[randomTypeIndex].offers ? types[randomTypeIndex].offers : ``;
    return availableOffers;
  };

  const availableOffers = createOffersforPoint();

  const getCheckedOffersforPoint = () => {
    const randomOffers = [];
    const randomOffersAmount = getRandomInteger(1, availableOffers.length);
    if (availableOffers) {
      for (let i = 0; i < randomOffersAmount; i++) {
        randomOffers.push({name: availableOffers[i].name, price: availableOffers[i].price});
      }
    }
    return randomOffers;
  };

  const createdPoint = {
    id: generateId(),
    type: types[randomTypeIndex].name,
    destination: DESTINATIONS[randomDestinationIndex].destination,
    date: {
      eventDate: generateRandomDate(),
      eventDuration: getRandomInteger(MIN_EVENT_DURATION_MINUTES, MAX_EVENT_DURATION_MINUTES)
    },
    checkedOffers: getCheckedOffersforPoint(),
    price: getRandomInteger(MIN_EVENT_PRICE, MAX_EVENT_PRICE),
    isFavourite: Boolean(getRandomInteger()),
    destinationInfo: DESTINATIONS[randomDestinationIndex].destinationInfo,
    photo: DESTINATIONS[randomDestinationIndex].destinationPhoto
  };

  return createdPoint;
};
