//budget controller  /// first module
let budgetController = (function() {
  // function constructor for expense object
  let Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 1) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  // function constructor for income object
  let Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let calculateTotal = function(type) {
    let sum = 0;
    data.allItems[type].forEach(function(current, index, arr) {
      sum += current.value;
    });
    data.totals[type] = sum;
  };

  let data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem: function(type, des, val) {
      let newItem, ID;

      // create new id
      data.allItems[type].length > 0
        ? (ID = data.allItems[type][data.allItems[type].length - 1].id + 1)
        : (ID = 0);

      //create new item based on whether type is inc or exp
      type === "inc"
        ? (newItem = new Income(ID, des, val))
        : (newItem = new Expense(ID, des, val));

      /// push it to our data structure
      data.allItems[type].push(newItem);

      //return the new element
      return newItem;
    },

    deleteItem: function(type, id) {
      let ids = data.allItems[type].map(function(current) {
        return current.id;
      });

      let index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function() {
      // calculate total income & expense
      calculateTotal("inc");
      calculateTotal("exp");
      // caculate the budget : income - exp
      data.budget = data.totals.inc - data.totals.exp;
      // calculate the percentage of total income that we spent
      data.totals.inc > 0
        ? (data.percentage = Math.round(
            (data.totals.exp / data.totals.inc) * 100
          ))
        : (data.percentage = -1);
    },
    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },

    calculatePercentage: function() {
      data.allItems.exp.forEach(function(current, i, arr) {
        current.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function() {
      let allperc = data.allItems.exp.map(function(el) {
        return el.getPercentage();
      });
      return allperc;
    },

    testing: function() {
      console.log(data);
    }
  };
})();

//UI controller  //// second module
/**************************** */
let uiController = (function() {
  let domStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
    incomeContainer: ".income__list",
    expenseContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expPercentageLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
  };

  let formatNumber = function(num, type) {
    let numSplit, int, dec;

    num = Math.abs(num);
    num = num.toFixed(2);
    numSplit = num.split(".");

    int = numSplit[0];
    dec = numSplit[1];

    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
    }

    return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
  };

  let nodeListForEach = function(list, callback) {
    for (let i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  return {
    getData: function() {
      return {
        type: document.querySelector(domStrings.inputType).value, // inc or exp
        description: document.querySelector(domStrings.inputDescription).value, //description
        value: parseFloat(document.querySelector(domStrings.inputValue).value) // amount of money
      };
    },
    domStrings: domStrings,
    addListItem: function(obj, type) {
      let html, newHtml, containerElement;
      //create html string with placeholder text

      if (type === "inc") {
        containerElement = domStrings.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"> <i class="ion-ios-close-outline"></i> </button> </div> </div> </div>';
      } else if (type === "exp") {
        containerElement = domStrings.expenseContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage"></div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
      }
      //replace the placeholder text with actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

      //insert the html into the dom
      document
        .querySelector(containerElement)
        .insertAdjacentHTML("beforeend", newHtml);
    },

    deleteListItem: function(selectorID) {
      let el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },
    clearFields: function() {
      let fieldsList, fieldsArr;

      fieldsList = document.querySelectorAll("input");
      fieldsArr = Array.from(fieldsList); // Array.prototype.slice.call(fieldsList);

      fieldsArr.forEach(function(current, index, arr) {
        current.value = "";
      });
      fieldsArr[0].focus();
    },
    displayBudget: function(obj) {
      let type;

      obj.budget >= 0 ? (type = "inc") : (type = "exp");

      document.querySelector(domStrings.budgetLabel).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(domStrings.incomeLabel).textContent = formatNumber(
        obj.totalInc,
        "inc"
      );
      document.querySelector(
        domStrings.expensesLabel
      ).textContent = formatNumber(obj.totalExp, "exp");

      obj.percentage > 0
        ? (document.querySelector(domStrings.percentageLabel).textContent =
            obj.percentage + "%")
        : (document.querySelector(domStrings.percentageLabel).textContent =
            "---");
    },
    displayPercentage: function(percentages) {
      let fields = document.querySelectorAll(domStrings.expPercentageLabel);

      nodeListForEach(fields, function(current, index) {
        if (percentages > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "--";
        }
      });
    },
    displayMonth: function() {
      let date, month, year, months;
      months = [
        "Jan",
        "Feb",
        "March",
        "april",
        "May",
        "June",
        "July",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "December"
      ];
      date = new Date();
      year = date.getFullYear();
      month = date.getMonth();

      document.querySelector(domStrings.dateLabel).textContent =
        months[month] + " " + year;
    },
    changedType: function() {
      let fields = document.querySelectorAll(
        domStrings.inputType +
          "," +
          domStrings.inputDescription +
          "," +
          domStrings.inputValue
      );

      nodeListForEach(fields, function(current) {
        current.classList.toggle("red-focus");
      });

      document.querySelector(domStrings.inputButton).classList.toggle("red");
    }
  };
})();

/*******************************************/
// Global app controller  /// third module
let controller = (function(budgetCtrl, uiCtrl) {
  let setupEventListeners = function() {
    let domStrings = uiCtrl.domStrings;

    document
      .querySelector(domStrings.inputButton)
      .addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function(event) {
      event.keyCode === 13 ? ctrlAddItem() : null;
    });

    document
      .querySelector(domStrings.container)
      .addEventListener("click", ctrlDeleteItem);

    document
      .querySelector(domStrings.inputType)
      .addEventListener("change", uiCtrl.changedType);
  };

  let updateBudget = function() {
    // 1/ calculate the budget
    budgetCtrl.calculateBudget();
    // 2/return the budget
    let budget = budgetCtrl.getBudget();

    // 3/display the budget to the dom
    uiCtrl.displayBudget(budget);
  };

  let updatePercentages = function() {
    // 1. calculate percentages
    budgetCtrl.calculatePercentage();
    // 2.read perentages from budget controller
    let percentages = budgetCtrl.getPercentages();
    // 3.update the user interface
    uiCtrl.displayPercentage(percentages);
  };

  ctrlAddItem = function() {
    let input, newItem;
    // 1/ get the field input data
    input = uiCtrl.getData();
    console.log(input);

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2/add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      budgetCtrl.testing();

      // 3/ add the item to the ui
      console.log(newItem);
      uiCtrl.addListItem(newItem, input.type);

      // 4/ clear the fields
      uiCtrl.clearFields();

      // 5/caluclate and update budget
      updateBudget();

      // 6/ calculate and update percentages
      updatePercentages();
    } else {
      alert("please complete all input fields");
    }
  };

  let ctrlDeleteItem = function(e) {
    let itemId = e.target.parentNode.parentNode.parentNode.parentNode.id;
    console.log(itemId);

    if (itemId) {
      //inc-1
      let splitId = itemId.split("-"),
        type = splitId[0],
        ID = parseInt(splitId[1]);

      //delte it from our data
      budgetCtrl.deleteItem(type, ID);
      budgetCtrl.testing();

      //delete it from ui
      uiCtrl.deleteListItem(itemId);

      //update the budget
      updateBudget();

      // update percentages
      updatePercentages();
    }
  };
  return {
    /// initialization function
    init: function() {
      console.log("app starts now");
      uiCtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      uiCtrl.displayMonth();
      setupEventListeners();
    }
  };
})(budgetController, uiController);

controller.init();
