export const createRouteInfoAndPriceTemplate = (createdRoute) => {
  const {firstPoint, middlePoint, lastPoint, startEventDate, endEventDate, totalPrice} = createdRoute;
  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${firstPoint} — ${middlePoint} — ${lastPoint}</h1>

    <p class="trip-info__dates">${startEventDate.format(`MMM DD`)}&nbsp;—&nbsp;${endEventDate.format(`DD`)}</p>
  </div>

  <p class="trip-info__cost">
    Total: €&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
  </p>
</section>`;
};
