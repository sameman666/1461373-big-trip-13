import SmartView from "./smart.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {ChartType} from "../const.js";

const BAR_HEIGHT = 35;
const CHART_LEFT_PADDING = 50;
const HOURS_PER_DAY = 24;

const countData = (uniqueLabels, points, typeOfChart) => {
  return uniqueLabels.map((label) => {
    const reducer = (total, currentPoint) => {
      if (currentPoint.type.toUpperCase() === label) {
        switch (typeOfChart) {
          case ChartType.MONEY:
            return total + Number(currentPoint.price);
          case ChartType.TYPE:
            return total + 1;
          case ChartType.TIME:
            return total + currentPoint.endEventDate.diff(currentPoint.eventDate, `hour`);
        }
      }
      return total;
    };
    const totalDataForThisType = points.reduce(reducer, 0);
    switch (typeOfChart) {
      case ChartType.TIME:
        return Math.floor(totalDataForThisType / HOURS_PER_DAY);
    }
    return totalDataForThisType;
  });
};

const renderMoneyChart = (moneyCtx, points) => {
  moneyCtx.height = BAR_HEIGHT * points.length;

  const labels = points.map(function (point) {
    return point.type.toUpperCase();
  });

  const uniqueLabels = [...new Set(labels)];

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: uniqueLabels,
      datasets: [{
        data: countData(uniqueLabels, points, ChartType.MONEY),
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
          dataset: {
            barThickness: 44,
          }
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
          dataset: {
            minBarLength: 50
          }
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

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: uniqueLabels,
      datasets: [{
        data: countData(uniqueLabels, points, ChartType.TYPE),
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
          dtaset: {
            barThickness: 44,
          }
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
          datatset: {
            minBarLength: 50
          }
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

  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: uniqueLabels,
      datasets: [{
        data: countData(uniqueLabels, points, ChartType.TIME),
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
          dataset: {
            barThickness: 44,
          }
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
          datatset: {
            minBarLength: 50
          }
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
  constructor(pointsModel) {
    super();

    this._pointsModel = pointsModel;

    this._setCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
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

    const points = this._pointsModel.getPoints();

    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const typeCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeCtx = this.getElement().querySelector(`.statistics__chart--time`);

    renderMoneyChart(moneyCtx, points);
    renderTypeChart(typeCtx, points);
    renderTimeChart(timeCtx, points);
  }
}

