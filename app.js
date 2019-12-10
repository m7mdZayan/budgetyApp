//budget controller
let budgetController = (function() {})();

//UI controller
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
// Global app controller
let controller = (function(budgetCtrl, uiCtrl) {
  let domStrings = uiCtrl.domStrings;

  ctrlAddItem = function() {
    let input = uiCtrl.getData();
    console.log(input);
  };

  document
    .querySelector(domStrings.inputButton)
    .addEventListener("click", ctrlAddItem);

  document.addEventListener("keypress", function(event) {
    event.keyCode === 13 ? ctrlAddItem() : null;
  });
})(budgetController, uiController);
