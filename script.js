// Get current date
let today = new Date();
let DD = today.getDate();
let MM = today.getMonth() + 1;
let YYYY = today.getFullYear();

if (DD < 10) {
  DD = '0' + DD;
}
if (MM < 10) {
  MM = '0' + MM;
}

document.querySelector('h5').textContent = DD + '/' + MM + '/' + YYYY;


//UI CONTROLLER
const UIcontroller = (() => {
  const DOMstrings = {
    inputDefaultMarkup: '#default-markup',
    inputCost: '#cost',
    inputTaxRate: '#tax-rate',
    inputRoundingRule: '#rounding-rule',
    inputPricingMode: '#pricing-mode',
    inclusiveValue: '.inclusive',
    exclusiveValue: '.exclusive',
    grossProfitPercent: '.profit-percent',
    grossProfitValue: '.profit-value',
    caclculateBtn: '.calculate'
  }
  return {
    getInput: () => {
      return {
        inputDefaultMarkup: {
          value: document.querySelector(DOMstrings.inputDefaultMarkup).value,
          validation: (value) => {
            value = parseInt(value);
            if(value < 10 || value > 200) {
              return false;
            } else {
              return true;
            }
          }
        },
        inputCost: {
          value: document.querySelector(DOMstrings.inputCost).value,
          validation: (value) => {
            value = parseInt(value);
            if (value < 0) {
              return false;
            } else {
              return true;
            }
          }
        },
        inputTaxRate: document.querySelector(DOMstrings.inputTaxRate).value,
        inputRoundingRule: document.querySelector(DOMstrings.inputRoundingRule).value,
        inputPricingMode: document.querySelector(DOMstrings.inputPricingMode).value,
        inclusiveValue: document.querySelector(DOMstrings.inclusiveValue),
        exclusiveValue: document.querySelector(DOMstrings.exclusiveValue),
        grossProfitPercent: document.querySelector(DOMstrings.grossProfitPercent),
        grossProfitValue: document.querySelector(DOMstrings.grossProfitValue)
      }
    },
    getDomStrings: () => {
      return DOMstrings;
    }
  }
})();


//GLOBAL CONTROLLER
const controller = ((UIctrl) => {
  const setupEventListeners = () => {
    const DOM = UIctrl.getDomStrings();
    document.querySelector(DOM.caclculateBtn).addEventListener('click', chackValidation);
  };

  const numberRounding = (num, roundingRule) => {
    num = Number(num);
    let fixedNum = Number(num.toFixed());

    //condition with rounding rule 99
    if (roundingRule === '99' && fixedNum > num) {
      return fixedNum - 0.01;
    }
    else if (roundingRule === '99' && fixedNum < num) {
      return fixedNum;
    }

    //condition with rounding rule 00
    if (roundingRule === '00') {
      return fixedNum.toFixed(2);
    }

    //condition with rounding rule 95
    if (roundingRule === '95' && fixedNum > num) {
      return fixedNum - 0.05;
    }
    else if (roundingRule === '95' && fixedNum < num) {
      return fixedNum;
    }
  };

  const showDiference = (incValue, exValue) => {
    if (incValue && exValue) {
      return {
        grossProfitPercent: (exValue - incValue) / exValue * 100,
        grossProfitValue: exValue - incValue
      }
    }
    return null;
  }

  const chackValidation = () => {
    let inputs, cost, markup, tax, priceMode;

    inputs = UIctrl.getInput();
    cost = Number(inputs.inputCost.value);
    markup = Number(inputs.inputDefaultMarkup.value);
    tax = Number(inputs.inputTaxRate);
    roundingRule = inputs.inputRoundingRule;
    priceMode = inputs.inputPricingMode;

    for(let input in inputs) {
      let curInput = inputs[input];

      if (curInput.hasOwnProperty('validation') && curInput.validation(curInput.value) === false) {
        alert("Your entered Default Markup & Cost values is not correct, pls try to fix it!");
        return;
      };
    }

    if (priceMode === 'Tax Inclusive Prices') {
      let taxIncPrice = inputs.inclusiveValue;
      let num = cost * (markup / 100);
      
      taxIncPrice.textContent = numberRounding(num, roundingRule);
    } else if (priceMode === 'Tax Exclusive Prices') {
      const taxExPrice = inputs.exclusiveValue,
            num = cost * (markup / 100),
            numWithTax = num + (num * tax / 100);

      taxExPrice.textContent = numberRounding(numWithTax, roundingRule);
    }

    const diff = showDiference(Number(inputs.inclusiveValue.textContent), Number(inputs.exclusiveValue.textContent));

    if(diff !== null) {
      inputs.grossProfitPercent.textContent = diff.grossProfitPercent.toFixed();
      inputs.grossProfitValue.textContent = diff.grossProfitValue.toFixed();
    }
  }
  
  return {
    init: () => {
      setupEventListeners();
    }
  }
})(UIcontroller);

controller.init();