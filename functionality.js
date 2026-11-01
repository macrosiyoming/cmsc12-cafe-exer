// Magalona, Marco Dominic A.
// CMSC 12 - U-3L
// Exer 11: Café Order Form with JavaScript - Add validity and computing capabilites for Exer 8/9 Café Order Dorm

// ===== prices =====
// Index mapping:
// [0-4]:   Drink Type (100, 120, 130, 140, 150)
// [5-7]:   Cup Size (0, 20, 40)
// [8-9]:   Drink Temp (0, 10)
// [10-12]: Add-ons (30, 20, 20)
// [13-16]: Pastries (80, 70, 90, 50)
var prices = [100, 120, 130, 140, 150, 0, 20, 40, 0, 10, 30, 20, 20, 80, 70, 90, 50];

// ===== variables =====
// computations
var costPerDrink = 0;
var drinkSubtotal = 0;
var pastrySubtotal = 0;
var initialTotal = 0;
var discount = 0;
var deliveryFee = 0;
var totalAmountDue = 0;

var missingFields = []; // list to store missing required fields

const form = document.getElementById('form'); // call the whole form element

// delivery/pickup radio buttons and address field
const delivery = form.querySelector('#delivery');
const pickup = form.querySelector('#pickup');
const addressField = form.querySelector('#address');

// customer information fields
const customerName = form.querySelector('#customer_name');
const mobileNumber = form.querySelector('#customer_num');
const emailAddress = form.querySelector('#customer_email');

// order information fields
const numberOfDrinks = form.querySelector('#num_of_drinks');
const orderDate = form.querySelector('#order_date');
const orderTime = form.querySelector('#order_time');

// drink and pastry selection fields
const drinkType = document.getElementsByName('drink_type');
const cupSizeRadios = document.getElementsByName('cup_size');
const drinkTempRadios = document.getElementsByName('drink_temp');
const drinkAddOnsCheckboxes = document.getElementsByName('drink_add_ons');
const pastriesCheckboxes = document.getElementsByName('pastries');

// helper functions, act similar to functions but is an object
// array.from() is used to convert the NodeList to an array
// .filter() to keep only the elements that are currently checked
// .reduce() to add together the prices mapped to each checked input's value index
const getCheckedSum = (nodeList) => 
    Array.from(nodeList)
        .filter(input => input.checked)
        .reduce((sum, input) => sum + prices[Number(input.value)], 0);

// helper functions, act similar to functions but is an object
// array.from() is used to convert the NodeList to an array
// filter() to keep only the elements that are currently checked
// changes the checked inputs to their parent element's text content
// then in which returns the items
const getCheckedLabels = (nodeList) => {
    const selected = Array.from(nodeList)
        .filter(input => input.checked)
        .map(input => input.parentElement.textContent.trim());
    return selected.length > 0 ? selected.join(', ') : 'None';
};

// helper functions, act similar to functions but is an object
// format to philippine peso currency rounded to 2 decimal places
const formatPeso = (val) => '₱' + val.toFixed(2);

// ===== functions =====
// checks for required fields and validity of inputs
function checkRequiredFields() {
    missingFields = [];

    // checks for missing fields
    if (!customerName.value.trim()) missingFields.push('Customer Name');
    if (!mobileNumber.value.trim()) missingFields.push('Mobile Number');
    if (!emailAddress.value.trim()) missingFields.push('Email Address');
    if (!numberOfDrinks.value.trim()) missingFields.push('Number of Drinks');
    if (!orderDate.value.trim()) missingFields.push('Order Date');
    if (!orderTime.value.trim()) missingFields.push('Order Time');

    // checks for invalid inputs if the field is not empty
    if (mobileNumber.value && !mobileNumber.checkValidity()) missingFields.push('Mobile Number (Must be 11 digits starting with 09)');
    if (emailAddress.value && !emailAddress.checkValidity()) missingFields.push('Email Address (Must be a valid email format)');
    if (numberOfDrinks.value && !numberOfDrinks.checkValidity()) missingFields.push('Number of Drinks (Must be a whole number from 1 to 10)');
    if (delivery.checked && !addressField.value.trim()) missingFields.push('Delivery Address is required.');
    if (orderDate.value && !futureDate(orderDate.value)) missingFields.push('Order Date (Must be after today)');
    if (orderTime.value && !timeRange(orderTime.value)) missingFields.push('Order Time (Must be between 6:00 AM and 6:00 PM)');

    // alerts missing or invalid fields
    if (missingFields.length > 0) {
        alert('Please fix or fill in the following required fields:\n\n• ' + missingFields.join('\n• '));
        return false;
    }

    return true;
}

// address field disabled state manipulation by delivery/pickup selection
function addressState() {
    addressField.disabled = pickup.checked;
    if (pickup.checked) addressField.value = ''; // reset address field
}

// checks if the date is in the future
function futureDate(dateString) {
    if (!dateString) return false; // if the date string is empty, return false
    const parts = dateString.split('-');
    if (parts.length !== 3 || parts[0].length < 4) return true; // to check if the date is incorrectly formatted

    // get today's date
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}`;

    // .padStart(2, '0') adds 0 in front of the string until its a 2 digit number
    // `${}` - template literal / f-string equivalent

    return dateString > todayFormatted; // compare the input date with today's date
}

// checks if the time is between 6:00 AM and 6:00 PM
function timeRange(timeString) {
    return timeString >= '06:00' && timeString <= '18:00';
}

// computes the cost per drink, subtotals, discount, delivery fee, and total amount due
function compute() {
    // get drinktype, cupsize, and drinktemp prices based on the selected values
    const drinkTypeSelect = form.querySelector('#drink_type');
    const selectedCupSize = Array.from(cupSizeRadios).find(r => r.checked);
    const selectedDrinkTemp = Array.from(drinkTempRadios).find(r => r.checked);

    // get prices
    const drinkTypePrice = drinkTypeSelect ? prices[Number(drinkTypeSelect.value)] : 0;
    const cupSizePrice = selectedCupSize ? prices[Number(selectedCupSize.value)] : 0;
    const drinkTempPrice = selectedDrinkTemp ? prices[Number(selectedDrinkTemp.value)] : 0;
    // html is modified in which drinkTypeSelect.value returns the index of prices

    // get add-ons price by summing the prices of checked add-ons
    const addOnsPrice = getCheckedSum(drinkAddOnsCheckboxes);
    pastrySubtotal = getCheckedSum(pastriesCheckboxes);

    // calculate cost per drink
    costPerDrink = drinkTypePrice + cupSizePrice + drinkTempPrice + addOnsPrice;

    // calculate subtotals, discount, delivery fee, and total amount due
    const count = Number(numberOfDrinks.value) || 0;
    drinkSubtotal = costPerDrink * count;
    initialTotal = drinkSubtotal + pastrySubtotal;

    // apply discount of 5% if 3 or more drinks are ordered
    discount = count >= 3 ? (0.05 * drinkSubtotal) : 0;
    deliveryFee = (delivery.checked && initialTotal < 500) ? 50 : 0;
    totalAmountDue = initialTotal - discount + deliveryFee;
}

// handles all form submission events:
// validation, computation, and alerts
function handleSubmit(event) {
    event.preventDefault(); // stop page reload

    if (checkRequiredFields()) {
        compute(); // calculate all costs and totals

        // get the selected drink, cup size, and drink temperature text content
        const selectedDrinkText = form.querySelector('#drink_type option:checked').textContent;
        const selectedSizeText = Array.from(cupSizeRadios).find(r => r.checked)?.parentElement.textContent.trim();
        const selectedTempText = Array.from(drinkTempRadios).find(r => r.checked)?.parentElement.textContent.trim();
        const selectedAddOnsText = getCheckedLabels(drinkAddOnsCheckboxes);
        const selectedPastriesText = getCheckedLabels(pastriesCheckboxes);

        // create a summary of the order details and costs
        const summary = 
            `----- CAFÉ ORDER SUMMARY -----\n` +
            `Customer Name: ${customerName.value}\n` +
            `Mobile Number: ${mobileNumber.value}\n` +
            `Email Address: ${emailAddress.value}\n` +
            `Order Type: ${delivery.checked ? 'Delivery' : 'Pickup'}\n` +
            (delivery.checked ? `Delivery Address: ${addressField.value}\n` : '') +
            `Order Date: ${orderDate.value}\n` +
            `Order Time: ${orderTime.value}\n\n` +
            `Selected Drink: ${selectedSizeText} ${selectedTempText} ${selectedDrinkText} (x${numberOfDrinks.value})\n` +
            `Add-ons: ${selectedAddOnsText}\n` +
            `Pastries: ${selectedPastriesText}\n` +
            `------------------------------\n` +
            `Cost per Drink: ${formatPeso(costPerDrink)}\n` +
            `Drink Subtotal: ${formatPeso(drinkSubtotal)}\n` +
            `Pastry Subtotal: ${formatPeso(pastrySubtotal)}\n` +
            `Initial Total: ${formatPeso(initialTotal)}\n` +
            `Discount: -${formatPeso(discount)}\n` +
            `Delivery Fee: ${formatPeso(deliveryFee)}\n` +
            `------------------------------\n` +
            `Total Amount Due: ${formatPeso(totalAmountDue)}`;

        alert(summary);
    }
}

// ===== event listeners =====
delivery.addEventListener('change', addressState); // listens to delivery radio
pickup.addEventListener('change', addressState); // listens to pickup radio

// event listener for form reset and submit
form.addEventListener('reset', () => {setTimeout(() => {addressState();}, 0);});
form.addEventListener('submit', handleSubmit);

addressState(); // initialize address field

// ===== references =====
// https://www.w3schools.com/jsref/event_onchange.asp
// https://www.w3schools.com/jsref/met_win_alert.asp
// https://www.w3schools.com/jsref/met_select_checkvalidity.asp
// https://www.w3schools.com/jsref/jsref_from.asp
// https://www.geeksforgeeks.org/python/javascript-equivalent-of-python-f-string/
// https://www.geeksforgeeks.org/javascript/javascript-helper-methods/
// https://www.w3schools.com/Jsref/jsref_string_padstart.asp
// https://www.w3schools.com/jsref/met_win_settimeout.asp
