import AbstractView from "../view/abstract.js";

export const Place = {
  BEFORE_BEGIN: `beforebegin`,
  AFTER_BEGIN: `afterbegin`,
  BEFORE_END: `beforeend`,
};

export const renderElement = (container, element, place) => {

  if (container instanceof AbstractView) {
    container = container.getElement();
  }

  if (element instanceof AbstractView) {
    element = element.getElement();
  }

  switch (place) {
    case Place.AFTER_BEGIN:
      container.prepend(element);
      break;
    case Place.BEFORE_END:
      container.append(element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};
