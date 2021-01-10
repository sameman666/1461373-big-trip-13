import SmartView from "./smart.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

const BAR_HEIGHT = 35;
const CHART_LEFT_PADDING = 50;

const renderMoneyChart = (moneyCtx, points) => {
  moneyCtx.height = BAR_HEIGHT * points.length;

  const labels = points.map(function (point) {
    return point.type.toUpperCase();
  });

  const uniqueLabels = [...new Set(labels)];

  const countAllPrices = () => {
    const prices = [];
    uniqueLabels.forEach((label) => {
      let totalPriceForThisType = 0;
      points.forEach((point) => {
        if (point.type.toUpperCase() === label) {
          totalPriceForThisType = totalPriceForThisType + point.price;
        }
      });
      prices.push(totalPriceForThisType);
    });
    return prices;
  };

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: uniqueLabels,
      datasets: [{
        data: countAllPrices(),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      layout: {
        padding: {
          left: CHART_LEFT_PADDING,
        }
      },
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTypeChart = (typeCtx, points) => {
  typeCtx.height = BAR_HEIGHT * points.length;

  const labels = points.map(function (point) {
    return point.type.toUpperCase();
  });

  const uniqueLabels = [...new Set(labels)];

  const countAllAmounts = () => {
    const amounts = [];
    uniqueLabels.forEach((label) => {
      let totalAmountOfThisType = 0;
      points.forEach((point) => {
        if (point.type.toUpperCase() === label) {
          totalAmountOfThisType = totalAmountOfThisType + 1;
        }
      });
      amounts.push(totalAmountOfThisType);
    });
    return amounts;
  };

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: uniqueLabels,
      datasets: [{
        data: countAllAmounts(),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      layout: {
        padding: {
          left: CHART_LEFT_PADDING,
        }
      },
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TYPE`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTimeChart = (timeCtx, points) => {
  timeCtx.height = BAR_HEIGHT * points.length;

  const labels = points.map(function (point) {
    return point.type.toUpperCase();
  });

  const uniqueLabels = [...new Set(labels)];

  const countAllTimes = () => {
    const times = [];
    uniqueLabels.forEach((label) => {
      let totalTimeForThisType = 0;
      points.forEach((point) => {
        if (point.type.toUpperCase() === label) {
          totalTimeForThisType = totalTimeForThisType + point.endEventDate.diff(point.eventDate, `day`);
        }
      });
      times.push(totalTimeForThisType);
    });
    return times;
  };

  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: uniqueLabels,
      datasets: [{
        data: countAllTimes(),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      layout: {
        padding: {
          left: CHART_LEFT_PADDING,
        }
      },
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}D`
        }
      },
      title: {
        display: true,
        text: `TIME-SPEND`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const createStatisticsTemplate = () => {
  return `<section class="statistics">
  <h2 class="visually-hidden">Trip statistics</h2>

  <div class="statistics__item statistics__item--money">
    <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
  </div>

  <div class="statistics__item statistics__item--transport">
    <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
  </div>

  <div class="statistics__item statistics__item--time-spend">
    <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
  </div>
</section>`;
};

export default class Statistics extends SmartView {
  constructor(points) {
    super();

    this._points = points;

    this._setCharts();
  }

  getTemplate() {
    return createStatisticsTemplate(this._points);
  }

  restoreHandlers() {
    this._setCharts();
  }

  hide() {
    this.getElement().classList.add(`trip-events--hidden`);
  }

  show() {
    this.getElement().classList.remove(`trip-events--hidden`);
  }

  _setCharts() {
    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const typeCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeCtx = this.getElement().querySelector(`.statistics__chart--time`);

    this._moneyChart = renderMoneyChart(moneyCtx, this._points);
    this._typeChart = renderTypeChart(typeCtx, this._points);
    this._timeChart = renderTimeChart(timeCtx, this._points);
  }
}

