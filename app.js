//budget controller  /// first module
let budgetController = (function() {
  // function constructor for expense object
  let Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // function constructor for income object
  let Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
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
    expenseContainer: ".expenses__list"
  };

  return {
    getData: function() {
      return {
        type: document.querySelector(domStrings.inputType).value, // inc or exp
        description: document.querySelector(domStrings.inputDescription).value, //description
        value: document.querySelector(domStrings.inputValue).value // amount of money
      };
    },
    domStrings: domStrings,
    addListItem: function(obj, type) {
      let html, newHtml, containerElement;
      //create html string with placeholder text

      if (type === "inc") {
        containerElement = domStrings.incomeContainer;
        html =
          '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"> <i class="ion-ios-close-outline"></i> </button> </div> </div> </div>';
      } else if (type === "exp") {
        containerElement = domStrings.expenseContainer;
        html =
          '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
      }
      //replace the placeholder text with actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);

      //insert the html into the dom
      document
        .querySelector(containerElement)
        .insertAdjacentHTML("beforeend", newHtml);
    },
    clearFields: function() {
      let fieldsList, fieldsArr;

      fieldsList = document.querySelectorAll("input");
      fieldsArr = Array.prototype.slice.call(fieldsList);

      fieldsArr.forEach(function(current, index, arr) {
        current.value = "";
      });
      fieldsArr[0].focus();
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
  };

  ctrlAddItem = function() {
    let input, newItem;
    // 1/ get the field input data
    input = uiCtrl.getData();
    console.log(input);

    // 2/add the item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    budgetCtrl.testing();

    // 3/ add the item to the ui
    console.log(newItem);
    uiCtrl.addListItem(newItem, input.type);

    // 4/ clear the fields
    uiCtrl.clearFields();
  };

  return {
    /// initialization function
    init: function() {
      console.log("app starts now");
      setupEventListeners();
    }
  };
})(budgetController, uiController);

controller.init();
