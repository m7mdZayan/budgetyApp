//budget controller  /// first module
let budgetController = (function() {
  let Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

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
    inputButton: ".add__btn"
  };

  return {
    getData: function() {
      return {
        type: document.querySelector(domStrings.inputType).value, // inc or exp
        description: document.querySelector(domStrings.inputDescription).value, //description
        value: document.querySelector(domStrings.inputValue).value // amount of money
      };
    },
    domStrings: domStrings
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
