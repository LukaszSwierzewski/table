import SERVICE from "./API/API.js";
import { sumAll, avgIncome } from "./components/math.js";
import { pagination } from "./pagination/pagination.js";
import { search } from "./components/search.js";
import { sortTable } from "./components/sort.js";

const DOM = {
  table: document.querySelector("#dataTable"),
  btn: document.querySelector("#search"),
  btnClean: document.querySelector("#clean"),
  th: document.getElementsByTagName("th"),
  lastMonth: document.querySelector("#lastMonth"),
};
const d = new Date();
d.setMonth(d.getMonth() - 1);
const prevMonth = d.toJSON().slice(0, 7);

const getData = async () => {
  const response = await SERVICE.fetchData();
  response.forEach(async (company, index) => {
    const response = await SERVICE.fetchIncome(company.id);
    company.income = response.incomes;
    company.income;

    let filtered = company.income.filter((val) => {
      return val.date.slice(0, 7) == prevMonth;
    });
    function sumPrevMonth(arr) {
      return filtered.reduce((prev, cur) => {
        return prev + parseFloat(cur.value);
      }, 0);
    }
    const prevMonthIncome = sumPrevMonth();
    let total = sumAll(company.income);
    let avg = avgIncome(company.income);
    const loader = `
    <tr class='item item-${index}' id=${company.id}>
    <td>${company.id}</td>
    <td>${company.name}</td>
    <td>${company.city}</td>
    <td>${total.toFixed(2)} $</td>
    <td>${avg} $</td>
    <td>${prevMonthIncome.toFixed(2)} $</td>
  </tr>
    `;
    DOM.table.insertAdjacentHTML("beforeend", loader);
  });
  document.querySelector(".dataSet").style.display = "block";
  document.querySelector(".loading").style.display = "none";
};

const cleanInput = () => {
  DOM.btnClean.addEventListener("click", () => {
    let input = (document.getElementById("search").value = "");
    document.querySelectorAll("a").forEach((e) => {
      e.parentNode.classList.remove("active");
    });
    search();
  });
};

const searchInit = () => {
  DOM.btn.addEventListener("keyup", () => {
    if (event.keyCode === 13) {
      search();
    }
  });
};

for (let c = 0; c < DOM.th.length; c++) {
  DOM.th[c].addEventListener("click", item(c));
}

function item(c) {
  return function () {
    sortTable(c);
  };
}

const init = () => {
  getData();
  pagination();
  searchInit();
  cleanInput();
  DOM.lastMonth.innerHTML = `Last month income (${prevMonth})`;
};

init();
