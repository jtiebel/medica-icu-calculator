const step1Next = document.querySelector('#step1Next');
const step2Next = document.querySelector('#step2Next');
const step3Next = document.querySelector('#step3Next');

const step2Back = document.querySelector('#step2Back');
const step3Back = document.querySelector('#step3Back');
const step4Back = document.querySelector('#step4Back');

const caseWorst = document.querySelector('#caseWorst');
const caseRegular = document.querySelector('#caseRegular');
const caseBest = document.querySelector('#caseBest');

const admissions = document.querySelectorAll('input[name="admissions"]');
const currencies = document.querySelectorAll('input[name="currencies"]');

var losBefore = $( "#losBefore" ).val();
var dailyCost = $( "#dailyCost" ).val();  

let selectedAdmissions;
let selectedCurrency;

$( "#losBeforeValue" ).html(losBefore);
$( "#dailyCostValue" ).html(dailyCost);

$(document).ready(function(){
  $('input').on('input', function(){
    losBefore = $( "#losBefore" ).val();
    $( "#losBeforeValue" ).html(losBefore);
    dailyCost = $( "#dailyCost" ).val();
    $( "#dailyCostValue" ).html(dailyCost);  
  });   
  $('#currencyUsd').on('click', function(){
    $( ".currency" ).html("USD");  
  });
  $('#currencyEur').on('click', function(){
    $( ".currency" ).html("EUR");  
  });
  $('#currencyGbp').on('click', function(){
    $( ".currency" ).html("GDP");  
  });
});

function setInputFilter(textbox, inputFilter, errMsg) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout"].forEach(function(event) {
    textbox.addEventListener(event, function(e) {
      if (inputFilter(this.value)) {
        if (["keydown","mousedown","focusout"].indexOf(e.type) >= 0){
          this.classList.remove("input-error");
          this.setCustomValidity("");
        }
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.classList.add("input-error");
        this.setCustomValidity(errMsg);
        this.reportValidity();
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      } else {
        this.value = "";
      }
    });
  });
}

setInputFilter(document.getElementById("admissionsAmount"), function(value) {
  return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 5000); }, "Must be between 200 and 5000");

$( "#admissionsAmount" ).on( "click", function() {
  $('input:radio[name=admissions][value=0]').click();
});

step1Next.addEventListener("click", () => {
  for (const admission of admissions) {
    if (admission.checked) {
      selectedAdmissions = admission.value;
      break;
    }
  }
  if(selectedAdmissions == 0) {
    selectedAdmissions = $('#admissionsAmount').val();
    if( isNaN(selectedAdmissions) || selectedAdmissions < 200 || selectedAdmissions > 5000){
      $( '.step1 .warning' ).show();
      $( '#admissionsAmount' ).addClass("input-error");
    } else {
      $( '.calculator-steps.step1' ).hide();
      $( '.calculator-steps.step2' ).show();
      $( '.progress-step1' ).removeClass("active");
      $( '.progress-step1' ).addClass("complete");
      $( '.progress-step2' ).addClass("active");
    }
  } else {
    $( '.calculator-steps.step1' ).hide();
    $( '.calculator-steps.step2' ).show();
    $( '.progress-step1' ).removeClass("active");
    $( '.progress-step1' ).addClass("complete");
    $( '.progress-step2' ).addClass("active");
  };
});

step2Next.addEventListener("click", () => {
  $( '.calculator-steps.step2' ).hide();
  $( '.calculator-steps.step3' ).show();
  $( '.progress-step2' ).removeClass("active");
  $( '.progress-step2' ).addClass("complete");
  $( '.progress-step3' ).addClass("active");
});

step3Next.addEventListener("click", () => {
  selectedCurrency;
  for (const currency of currencies) {
    if (currency.checked) {
      selectedCurrency = currency.value;
      break;
    }
  }

  const minLosAfter = losBefore - 1.4;
  const maxLosAfter = losBefore - 2.0;
  const costBefore = dailyCost * losBefore;
  const minCostAfter = dailyCost * minLosAfter;
  const maxCostAfter = dailyCost * maxLosAfter;
  const minCostSavings = costBefore - minCostAfter
  const maxCostSavings = costBefore - maxCostAfter

  let programCost;
  if(selectedAdmissions < 600){
    programCost = selectedAdmissions * 250;
  } else if (selectedAdmissions < 1800){
    programCost = selectedAdmissions * 400;
  } else {
    programCost = selectedAdmissions * 300;
  }

  minAnnualCostSavings = (minCostSavings * selectedAdmissions - programCost) * 0.46
  maxAnnualCostSavings = (maxCostSavings * selectedAdmissions - programCost) * 0.46
  
  $( '.calculator-steps.step3' ).hide();
  $( '.minDays' ).html(minLosAfter);
  $( '.maxDays' ).html(maxLosAfter);
  $( '.minCostSavings' ).html( Math.round(minAnnualCostSavings).toLocaleString('en-EN'));
  $( '.maxCostSavings' ).html( Math.round(maxAnnualCostSavings).toLocaleString('en-EN'));
  $( '.selectedCurrency').text(selectedCurrency);
  $( '.calculator-steps.result' ).show();
  $( '.progress-step3' ).removeClass("active");
  $( '.progress-step3' ).addClass("complete");
});

step2Back.addEventListener("click", () => {
  $( '.calculator-steps.step2' ).hide();
  $( '.calculator-steps.step1' ).show();
  $( '.progress-step2' ).removeClass("active");
  $( '.progress-step2' ).removeClass("complete");
  $( '.progress-step1' ).addClass("active");
});

step3Back.addEventListener("click", () => {
  $( '.calculator-steps.step3' ).hide();
  $( '.calculator-steps.step2' ).show();
  $( '.progress-step3' ).removeClass("active");
  $( '.progress-step3' ).removeClass("complete");
  $( '.progress-step2' ).addClass("active");
});

step4Back.addEventListener("click", () => {
  $( '.calculator-steps.step4' ).hide();
  $( '.calculator-steps.step3' ).show();
  $( '.progress-step3' ).removeClass("complete");
  $( '.progress-step3' ).addClass("active");
});

caseWorst.addEventListener("click", () => {
  $( '.minCostSavings' ).html( Math.round(minAnnualCostSavings * 0.8).toLocaleString('en-EN'));
  $( '.maxCostSavings' ).html( Math.round(maxAnnualCostSavings * 0.8).toLocaleString('en-EN'));
});

caseRegular.addEventListener("click", () => {
  $( '.minCostSavings' ).html( Math.round(minAnnualCostSavings * 1.0).toLocaleString('en-EN'));
  $( '.maxCostSavings' ).html( Math.round(maxAnnualCostSavings * 1.0).toLocaleString('en-EN'));
});

caseBest.addEventListener("click", () => {
  $( '.minCostSavings' ).html( Math.round(minAnnualCostSavings * 1.2).toLocaleString('en-EN'));
  $( '.maxCostSavings' ).html( Math.round(maxAnnualCostSavings * 1.2).toLocaleString('en-EN'));
});