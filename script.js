// Automatically trigger numeric keyboard on input fields
document.querySelectorAll('input[type="number"]').forEach(input => {
  input.addEventListener('focus', function() {
    this.type = 'number';
  });
});
// Utility function to get numeric value from an input field by ID
function getNumberById(id) {
  const value = parseFloat(document.getElementById(id).value);
  return isNaN(value) ? 0 : value;
}
// Initial default client return percentage
let defaultClientReturnPercentage = 0.70;
// Function to calculate and display the admin and client values
function calculateValues() {
  let ptPricePerGram = getNumberById("pt-price");
  let pdPricePerGram = getNumberById("pd-price");
  let rhPricePerGram = getNumberById("rh-price");
  let exchangeRate = getNumberById("exchange-rate");
  
  let ptPpm = getNumberById("pt-ppm");
  let pdPpm = getNumberById("pd-ppm");
  let rhPpm = getNumberById("rh-ppm");
  
  let clientReturnPercentage = getNumberById("return-percentage") || (defaultClientReturnPercentage * 100);
  let maxPrice = getNumberById("max-price");
  let materialCost = getNumberById("material-cost");
  
  // Admin Real Value Calculation using standard return percentages
  let adminRealValue = ((ptPricePerGram * ptPpm * 0.98) + (pdPricePerGram * pdPpm * 0.98) + (rhPricePerGram * rhPpm * 0.90)) / 1000; // Convert from $/gram to $/kg
  document.getElementById("admin-real-value").textContent = adminRealValue.toFixed(2);
  
  // Client Price Calculation using the client-specific return percentage
  let clientRealValue = ((ptPricePerGram * ptPpm) + (pdPricePerGram * pdPpm) + (rhPricePerGram * rhPpm)) * (clientReturnPercentage / 100) / 1000; // Convert from $/gram to $/kg
  document.getElementById("client-real-value").textContent = clientRealValue.toFixed(2); // Real value before applying max price
  
  // Final Client Price considering the maxPrice cap
  let finalClientPrice = Math.min(clientRealValue, maxPrice);
  
  // Display Client Price and Price with Exchange Rate
  document.getElementById("calculated-price").textContent = finalClientPrice.toFixed(2);
  document.getElementById("price-with-rate").textContent = (finalClientPrice * exchangeRate).toFixed(2);
  
  // Profit Margin for Admin
  let adminProfit = adminRealValue - materialCost - finalClientPrice;
  document.getElementById("admin-profit").textContent = adminProfit.toFixed(2);
}
// Event listeners for dynamic calculations
document.querySelectorAll('#pt-price, #pd-price, #rh-price, #exchange-rate, #pt-ppm, #pd-ppm, #rh-ppm, #return-percentage, #material-cost').forEach(input => {
  input.addEventListener('input', calculateValues);
});
document.getElementById("max-price").addEventListener("input", function() {
  document.getElementById("max-price-output").textContent = this.value;
  calculateValues(); // Recalculate to update displayed prices
});
// Show or hide admin values
document.getElementById("show-admin-btn").addEventListener("click", function () {
  document.getElementById("admin-values").style.display = "block";
  calculateValues(); // Ensure values are recalculated when showing admin values
});
document.getElementById("hide-admin-btn").addEventListener("click", function () {
  document.getElementById("admin-values").style.display = "none";
});
// Hamburger menu for admin settings
document.getElementById("menu-btn").addEventListener("click", function () {
  let adminPanel = document.getElementById("admin-settings");
  adminPanel.style.display = (adminPanel.style.display === "block") ? "none" : "block";
});
// Close admin settings and save values 
document.getElementById("close-admin-btn").addEventListener("click", function () {
  let adminPanel = document.getElementById("admin-settings");
  adminPanel.style.display = "none";
  calculateValues(); 
  // Ensure any changes made are saved
});
// Initial values calculation to populate fields with default values
calculateValues();