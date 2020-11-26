import dayjs from "dayjs";

const DAYS_AMOUNT = 7;
const DECRIPTION_SENTENCES_AMOUNT = 5;
const MIN_EVENT_DURATION_MINUTES = 20;
const MAX_EVENT_DURATION_MINUTES = 1800;
const MIN_EVENT_PRICE = 20;
const MAX_EVENT_PRICE = 100;
const DESCRIPTION = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`];
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

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

const generateRandomPhotos = () => {
  let photos = [];
  let randomAmountOfPhotos = getRandomInteger(1, 5);
  for (let i = 0; i < randomAmountOfPhotos; i++) {
    const image = `<img class="event__photo" src="http://picsum.photos/248/152?r=${Math.random()}" alt="Event photo">`;
    photos.push(image);
  }
  return `<div class="event__photos-container">
  <div class="event__photos-tape">
    ${photos.join(``)}
  </div>
</div>`;
};

const DESTINATIONS = [
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

const types = [
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
  let eventList = [];
  for (let i = 0; i < types.length; i++) {
    eventList.push(`<div class="event__type-item">
      <input id="event-type-${types[i].name.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${types[i].name.toLowerCase()}">
      <label class="event__type-label  event__type-label--${types[i].name.toLowerCase()}" for="event-type-${types[i].name.toLowerCase()}-1">${types[i].name}</label>
    </div>`);
  }
  return eventList.join(``);
};

export const createCityList = () => {
  let cityList = [];
  for (let i = 0; i < DESTINATIONS.length; i++) {
    cityList.push(`<option value="${DESTINATIONS[i].destination}"></option>`);
  }
  return cityList.join(``);
};

const generateRandomDate = () => {
  const randomIndex = getRandomInteger(1, DAYS_AMOUNT);
  return dayjs().add(randomIndex, `day`);
};

export const createPoint = () => {
  const randomDestinationIndex = getRandomInteger(0, DESTINATIONS.length - 1);
  const randomTypeIndex = getRandomInteger(0, types.length - 1);

  const createOffersforPoint = () => {
    let AvailableOffers = ``;
    if (types[randomTypeIndex].offers) {
      AvailableOffers = types[randomTypeIndex].offers;
    }
    return AvailableOffers;
  };

  const createdPoint = {
    type: types[randomTypeIndex].name,
    destination: DESTINATIONS[randomDestinationIndex].destination,
    date: {
      eventDate: generateRandomDate(),
      eventDuration: getRandomInteger(MIN_EVENT_DURATION_MINUTES, MAX_EVENT_DURATION_MINUTES)
    },
    offers: createOffersforPoint(),
    price: getRandomInteger(MIN_EVENT_PRICE, MAX_EVENT_PRICE),
    isFavourite: Boolean(getRandomInteger()),
    destinationInfo: DESTINATIONS[randomDestinationIndex].destinationInfo,
    photo: DESTINATIONS[randomDestinationIndex].destinationPhoto
  };

  return createdPoint;
};
