// =====================================================
// JJN HUB AUTOMOTIVE MANAGEMENT SYSTEM
// automotive.js
// PART 1 - INITIALIZATION
// =====================================================

// -----------------------------------------------------
// USE EXISTING SUPABASE CLIENT FROM auth.js
// NEVER CREATE A NEW CLIENT HERE
// -----------------------------------------------------

const db = window.supabaseClient;

if (!db) {

    console.error("Supabase client was not found.");

}

// -----------------------------------------------------
// DATABASE CACHE
// -----------------------------------------------------

let auctionFees = [];
let inlandRates = [];
let shippingRates = [];
let vehicleEstimates = [];

// -----------------------------------------------------
// VEHICLE INFORMATION
// -----------------------------------------------------

const make = document.getElementById("make");
const model = document.getElementById("model");
const year = document.getElementById("year");
const vin = document.getElementById("vin");
const vehicleType = document.getElementById("vehicleType");

// -----------------------------------------------------
// PURCHASE
// -----------------------------------------------------

const auction = document.getElementById("auction");
const auctionYard = document.getElementById("auctionYard");

const purchasePrice = document.getElementById("purchasePrice");
const auctionFee = document.getElementById("auctionFee");
const buyingCost = document.getElementById("buyingCost");

const buyerType = document.getElementById("buyerType");
const titleType = document.getElementById("titleType");

// -----------------------------------------------------
// SHIPPING
// -----------------------------------------------------

const destinationCountry =
document.getElementById("destinationCountry");

const destinationPort =
document.getElementById("destinationPort");

const shippingType =
document.getElementById("shippingType");

const loadingPort =
document.getElementById("loadingPort");

const inlandTransport =
document.getElementById("inlandTransport");

const shippingCost =
document.getElementById("shippingCost");

const insurance =
document.getElementById("insurance");

const documentation =
document.getElementById("documentation");

const portHandling =
document.getElementById("portHandling");

const terminalStorage =
document.getElementById("terminalStorage");

const totalShipping =
document.getElementById("totalShipping");

// -----------------------------------------------------
// NIGERIA COSTS
// -----------------------------------------------------

const exchangeRate =
document.getElementById("exchangeRate");

const customDuty =
document.getElementById("customDuty");

const clearingCost =
document.getElementById("clearingCost");

const deliveryCost =
document.getElementById("deliveryCost");

const otherCost =
document.getElementById("otherCost");

const profit =
document.getElementById("profit");

// -----------------------------------------------------
// SUMMARY
// -----------------------------------------------------

const summaryPurchase =
document.getElementById("summaryPurchase");

const summaryAuctionFee =
document.getElementById("summaryAuctionFee");

const summaryBuying =
document.getElementById("summaryBuying");

const summaryInland =
document.getElementById("summaryInland");

const summaryFreight =
document.getElementById("summaryFreight");

const summaryInsurance =
document.getElementById("summaryInsurance");

const summaryDocumentation =
document.getElementById("summaryDocumentation");

const summaryHandling =
document.getElementById("summaryHandling");

const summaryStorage =
document.getElementById("summaryStorage");

const summaryShipping =
document.getElementById("summaryShipping");

const summaryRate =
document.getElementById("summaryRate");

const summaryDuty =
document.getElementById("summaryDuty");

const summaryClearing =
document.getElementById("summaryClearing");

const summaryDelivery =
document.getElementById("summaryDelivery");

const summaryOther =
document.getElementById("summaryOther");

const summaryLanded =
document.getElementById("summaryLanded");

const summarySelling =
document.getElementById("summarySelling");

// -----------------------------------------------------
// ESTIMATE TABLE
// -----------------------------------------------------

const estimateTableBody =
document.getElementById("estimateTableBody");

const estimateSearch =
document.getElementById("estimateSearch");

// -----------------------------------------------------
// HELPERS
// -----------------------------------------------------

function num(value){

    return Number(value || 0);

}

function money(value){

    return Number(value || 0).toLocaleString(

        undefined,

        {

            minimumFractionDigits:2,

            maximumFractionDigits:2

        }

    );

}

// -----------------------------------------------------
// LOAD LOOKUP TABLES
// -----------------------------------------------------

async function loadLookupTables(){

    console.log("Loading lookup tables...");

    // Auction Fees

    let {data,error} = await db

    .from("auction_fees")

    .select("*");

    if(error){

        console.error(error);

    }else{

        auctionFees = data;

    }

    // Inland Rates

    ({data,error}=await db

    .from("inland_rates")

    .select("*"));

    if(error){

        console.error(error);

    }else{

        inlandRates = data;

    }

    // Shipping Rates

    ({data,error}=await db

    .from("shipping_rates")

    .select("*"));

    if(error){

        console.error(error);

    }else{

        shippingRates = data;

    }

    console.log(

        "Auction Fees :",auctionFees.length

    );

    console.log(

        "Inland Rates :",inlandRates.length

    );

    console.log(

        "Shipping Rates :",shippingRates.length

    );

}

// =====================================================
// PART 2 - AUCTION & SHIPPING LOOKUPS
// =====================================================

// -------------------------------------
// Find Auction Fee
// -------------------------------------

function getAuctionFee() {

    const house = auction.value;
    const price = num(purchasePrice.value);

    if (!house || price <= 0) {

        auctionFee.value = "";
        buyingCost.value = "";

        return;

    }

    const feeRow = auctionFees.find(row =>

        row.auction_house === house &&
        price >= row.min_price &&
        price <= row.max_price

    );

    if (!feeRow) {

        auctionFee.value = 0;
        buyingCost.value = price.toFixed(2);

        return;

    }

    auctionFee.value = feeRow.fee;

    buyingCost.value = (

        price +

        Number(feeRow.fee)

    ).toFixed(2);

}

// -------------------------------------
// Find Inland Transport
// -------------------------------------

function getInlandRate() {

    const yard = auctionYard.value;
    const destination = destinationPort.value;

    if (!yard || !destination) return;

    const row = inlandRates.find(rate =>

        rate.auction_yard === yard &&
        rate.destination_port === destination

    );

    if (!row) return;

    loadingPort.value = row.loading_port;

    inlandTransport.value = row.inland_cost;

    // Refresh shipping because loading port changed
    getShippingRate();

}
// -------------------------------------
// Find Shipping Rate
// -------------------------------------

function getShippingRate() {

    const port = loadingPort.value;
    const destination = destinationPort.value;
    const method = shippingType.value;

    if (!port || !destination || !method) return;

    const row = shippingRates.find(rate =>

        rate.loading_port === port &&
        rate.destination_port === destination &&
        rate.shipping_type === method

    );

    if (!row) {

        shippingCost.value = "";
        insurance.value = "";
        documentation.value = "";
        portHandling.value = "";
        terminalStorage.value = "";
        totalShipping.value = "";

        return;

    }

    shippingCost.value = row.freight;

    insurance.value = row.insurance;

    documentation.value = row.documentation;

    portHandling.value = row.port_handling;

    terminalStorage.value = row.terminal_storage;

    calculateShipping();

}
// -------------------------------------
// Shipping Total
// -------------------------------------

function calculateShipping() {

    const total =

        num(inlandTransport.value) +

        num(shippingCost.value) +

        num(insurance.value) +

        num(documentation.value) +

        num(portHandling.value) +

        num(terminalStorage.value);

    totalShipping.value = total.toFixed(2);

}

// -------------------------------------
// Automatic Lookups
// -------------------------------------

auction.addEventListener("change", getAuctionFee);

purchasePrice.addEventListener("input", getAuctionFee);

auctionYard.addEventListener("change", getInlandRate);

destinationPort.addEventListener("change", () => {

    getInlandRate();

    getShippingRate();

});

shippingType.addEventListener("change", getShippingRate);
// =====================================================
// PART 3 - CALCULATOR ENGINE
// =====================================================

function calculateVehicleCost() {

    // ----------------------------------
    // Ensure automatic lookups are current
    // ----------------------------------

    getAuctionFee();

    getInlandRate();

    getShippingRate();

    // ----------------------------------
    // USD Totals
    // ----------------------------------

    const purchase = num(purchasePrice.value);

    const fee = num(auctionFee.value);

    const buying = purchase + fee;

    const inland = num(inlandTransport.value);

    const freight = num(shippingCost.value);

    const insure = num(insurance.value);

    const docs = num(documentation.value);

    const handling = num(portHandling.value);

    const storage = num(terminalStorage.value);

    const shipping =

        inland +

        freight +

        insure +

        docs +

        handling +

        storage;

    const totalUSD =

        buying +

        shipping;

    // ----------------------------------
    // Nigeria Costs
    // ----------------------------------

    const rate = num(exchangeRate.value);

    const duty = num(customDuty.value);

    const clearing = num(clearingCost.value);

    const delivery = num(deliveryCost.value);

    const other = num(otherCost.value);

    const desiredProfit = num(profit.value);

    const landed =

        (totalUSD * rate) +

        duty +

        clearing +

        delivery +

        other;

    const selling =

        landed +

        desiredProfit;

    // ----------------------------------
    // Update Summary
    // ----------------------------------

    summaryPurchase.innerHTML =
        "$" + money(purchase);

    summaryAuctionFee.innerHTML =
        "$" + money(fee);

    summaryBuying.innerHTML =
        "$" + money(buying);

    summaryInland.innerHTML =
        "$" + money(inland);

    summaryFreight.innerHTML =
        "$" + money(freight);

    summaryInsurance.innerHTML =
        "$" + money(insure);

    summaryDocumentation.innerHTML =
        "$" + money(docs);

    summaryHandling.innerHTML =
        "$" + money(handling);

    summaryStorage.innerHTML =
        "$" + money(storage);

    summaryShipping.innerHTML =
        "$" + money(shipping);

    summaryRate.innerHTML =
        "₦" + money(rate);

    summaryDuty.innerHTML =
        "₦" + money(duty);

    summaryClearing.innerHTML =
        "₦" + money(clearing);

    summaryDelivery.innerHTML =
        "₦" + money(delivery);

    summaryOther.innerHTML =
        "₦" + money(other);

    summaryLanded.innerHTML =
        "₦" + money(landed);

    summarySelling.innerHTML =
        "₦" + money(selling);

    console.log("Vehicle calculation complete.");

    return {

        purchase,
        fee,
        buying,
        inland,
        freight,
        insure,
        docs,
        handling,
        storage,
        shipping,
        totalUSD,
        landed,
        selling

    };

}

// =====================================================
// AUTO RECALCULATE
// =====================================================

[
    purchasePrice,
    exchangeRate,
    customDuty,
    clearingCost,
    deliveryCost,
    otherCost,
    profit
].forEach(input => {

    input.addEventListener("input", calculateVehicleCost);

});
// =====================================================
// PART 4 - SUPABASE ESTIMATES
// =====================================================

// ------------------------------------------
// Save Vehicle Estimate
// ------------------------------------------

async function saveEstimate() {

    const totals = calculateVehicleCost();

    const estimate = {

        make: make.value,

        model: model.value,

        year: Number(year.value),

        vin: vin.value,

        vehicle_type: vehicleType.value,

        auction_house: auction.value,

        auction_yard: auctionYard.value,

        buyer_type: buyerType.value,

        title_type: titleType.value,

        purchase_price: num(purchasePrice.value),

        auction_fee: num(auctionFee.value),

        buying_cost: totals.buying,

        destination_country: destinationCountry.value,

        destination_port: destinationPort.value,

        shipping_type: shippingType.value,

        loading_port: loadingPort.value,

        inland_transport: totals.inland,

        ocean_freight: totals.freight,

        insurance: totals.insure,

        documentation: totals.docs,

        port_handling: totals.handling,

        terminal_storage: totals.storage,

        total_shipping: totals.shipping,

        exchange_rate: num(exchangeRate.value),

        custom_duty: num(customDuty.value),

        clearing_cost: num(clearingCost.value),

        delivery_cost: num(deliveryCost.value),

        other_cost: num(otherCost.value),

        landed_cost: totals.landed,

        desired_profit: num(profit.value),

        selling_price: totals.selling

    };

    const { error } = await db

        .from("vehicle_estimates")

        .insert([estimate]);

    if (error) {

        console.error(error);

        alert(error.message);

        return;

    }

    alert("Estimate saved successfully.");

    loadEstimateHistory();

}

// ------------------------------------------
// Load Estimate History
// ------------------------------------------

async function loadEstimateHistory() {

    const { data, error } = await db

        .from("vehicle_estimates")

        .select("*")

        .order("id", { ascending: false });

    if (error) {

        console.error(error);

        return;

    }

    vehicleEstimates = data;

    renderEstimateTable(data);

}

// ------------------------------------------
// Render Table
// ------------------------------------------

function renderEstimateTable(data) {

    estimateTableBody.innerHTML = "";

    data.forEach(item => {

        estimateTableBody.innerHTML += `

<tr>

<td>${item.id}</td>

<td>${item.make} ${item.model}</td>

<td>${item.vin}</td>

<td>${item.auction_house}</td>

<td>$${money(item.purchase_price)}</td>

<td>₦${money(item.landed_cost)}</td>

<td>₦${money(item.selling_price)}</td>

<td>

${new Date(item.created_at).toLocaleDateString()}

</td>

<td>

<button
class="action-btn"
onclick="openEstimate(${item.id})">

Open

</button>

<button
class="action-btn"
onclick="deleteEstimate(${item.id})">

Delete

</button>

</td>

</tr>

`;

    });

}

// ------------------------------------------
// Search Estimates
// ------------------------------------------

estimateSearch.addEventListener("input", () => {

    const text = estimateSearch.value.toLowerCase();

    const filtered = vehicleEstimates.filter(item =>

        (item.make || "").toLowerCase().includes(text) ||

        (item.model || "").toLowerCase().includes(text) ||

        (item.vin || "").toLowerCase().includes(text) ||

        (item.auction_house || "").toLowerCase().includes(text)

    );

    renderEstimateTable(filtered);

});

// ------------------------------------------
// Delete Estimate
// ------------------------------------------

async function deleteEstimate(id) {

    if (!confirm("Delete this estimate?")) return;

    const { error } = await db

        .from("vehicle_estimates")

        .delete()

        .eq("id", id);

    if (error) {

        alert(error.message);

        return;

    }

    loadEstimateHistory();

}

// ------------------------------------------
// Open Estimate
// ------------------------------------------

async function openEstimate(id) {

    const estimate = vehicleEstimates.find(e => e.id === id);

    if (!estimate) return;

    make.value = estimate.make;
    model.value = estimate.model;
    year.value = estimate.year;
    vin.value = estimate.vin;

    vehicleType.value = estimate.vehicle_type;

    auction.value = estimate.auction_house;
    auctionYard.value = estimate.auction_yard;

    buyerType.value = estimate.buyer_type;
    titleType.value = estimate.title_type;

    purchasePrice.value = estimate.purchase_price;

    destinationCountry.value = estimate.destination_country;
    destinationPort.value = estimate.destination_port;

    shippingType.value = estimate.shipping_type;

    exchangeRate.value = estimate.exchange_rate;
    customDuty.value = estimate.custom_duty;
    clearingCost.value = estimate.clearing_cost;
    deliveryCost.value = estimate.delivery_cost;
    otherCost.value = estimate.other_cost;
    profit.value = estimate.desired_profit;

    calculateVehicleCost();

}
// =====================================================
// PART 5 - UTILITIES & INITIALIZATION
// =====================================================

// -----------------------------------------------------
// Generate Estimate Number
// -----------------------------------------------------

function generateEstimateNumber() {

    const today = new Date();

    return `EST-${today.getFullYear()}-${Date.now()}`;

}

// -----------------------------------------------------
// Reset Calculator
// -----------------------------------------------------

function resetCalculator() {

    document.getElementById("vehicleCalculator").reset();

    [
        auctionFee,
        buyingCost,
        loadingPort,
        inlandTransport,
        shippingCost,
        insurance,
        documentation,
        portHandling,
        terminalStorage,
        totalShipping

    ].forEach(input => {

        if(input){

            input.value="";

        }

    });

    [
        summaryPurchase,
        summaryAuctionFee,
        summaryBuying,
        summaryInland,
        summaryFreight,
        summaryInsurance,
        summaryDocumentation,
        summaryHandling,
        summaryStorage,
        summaryShipping,
        summaryRate,
        summaryDuty,
        summaryClearing,
        summaryDelivery,
        summaryOther,
        summaryLanded,
        summarySelling

    ].forEach(label=>{

        if(label){

            label.innerHTML="0.00";

        }

    });

}

// -----------------------------------------------------
// Print Estimate
// -----------------------------------------------------

function printEstimate(){

    calculateVehicleCost();

    window.print();

}

// -----------------------------------------------------
// Email Estimate
// -----------------------------------------------------

async function emailEstimate(){

    alert(

        "Email integration will be connected to Brevo SMTP in the next module."

    );

}

// -----------------------------------------------------
// Dashboard Statistics
// -----------------------------------------------------

async function loadDashboardStats(){

    const {count,error}=await db

    .from("vehicle_estimates")

    .select("*",{

        count:"exact",

        head:true

    });

    if(error){

        console.error(error);

        return;

    }

    const saved=document.getElementById(

        "savedEstimates"

    );

    if(saved){

        saved.innerHTML=count;

    }

}

// -----------------------------------------------------
// Initialize
// -----------------------------------------------------

async function initializeAutomotive(){

    console.log(

        "Initializing Automotive Module..."

    );

    await loadLookupTables();

    await loadEstimateHistory();

    await loadDashboardStats();

    calculateVehicleCost();

    console.log(

        "Automotive Module Ready."

    );

}

// -----------------------------------------------------
// Page Loaded
// -----------------------------------------------------

window.addEventListener(

    "DOMContentLoaded",

    initializeAutomotive

);
// =====================================================
// PART 6 - FINAL MODULE
// Inventory, Orders, Shortcuts & Notifications
// =====================================================

// --------------------------------------------
// Toast Notification
// --------------------------------------------

function showToast(message, type = "success") {

    let toast = document.getElementById("toastMessage");

    if (!toast) {

        toast = document.createElement("div");

        toast.id = "toastMessage";

        toast.style.position = "fixed";
        toast.style.top = "20px";
        toast.style.right = "20px";
        toast.style.padding = "15px 20px";
        toast.style.borderRadius = "8px";
        toast.style.color = "#fff";
        toast.style.fontWeight = "600";
        toast.style.zIndex = "99999";
        toast.style.transition = "0.3s";

        document.body.appendChild(toast);

    }

    toast.style.background =

        type === "error"

        ? "#d32f2f"

        : "#198754";

    toast.innerHTML = message;

    toast.style.display = "block";

    setTimeout(() => {

        toast.style.display = "none";

    }, 3000);

}

// --------------------------------------------
// Vehicle Inventory
// --------------------------------------------

async function loadVehicleInventory() {

    const body = document.getElementById("vehicleInventoryBody");

    if (!body) return;

    body.innerHTML = "";

    const { data, error } = await db

        .from("vehicle_estimates")

        .select("*")

        .order("created_at", {

            ascending: false

        });

    if (error) {

        console.error(error);

        return;

    }

    data.forEach(car => {

        body.innerHTML += `

<tr>

<td>

${car.estimate_number ?? car.id}

</td>

<td>

${car.make} ${car.model}

</td>

<td>

${car.year}

</td>

<td>

Available

</td>

<td>

$${money(car.buying_cost)}

</td>

<td>

₦${money(car.selling_price)}

</td>

<td>

<button

class="action-btn"

onclick="openEstimate(${car.id})">

Open

</button>

</td>

</tr>

`;

    });

}

// --------------------------------------------
// Customer Orders
// --------------------------------------------

async function loadCustomerOrders() {

    const body = document.getElementById(

        "customerOrdersBody"

    );

    if (!body) return;

    body.innerHTML = "";

    const { data, error } = await db

        .from("customers")

        .select("*")

        .limit(20);

    if (error) {

        console.error(error);

        return;

    }

    data.forEach(customer => {

        body.innerHTML += `

<tr>

<td>

${customer.id}

</td>

<td>

${customer.name}

</td>

<td>

${customer.vehicle ?? "-"}

</td>

<td>

Pending

</td>

<td>

<button class="action-btn">

View

</button>

</td>

</tr>

`;

    });

}

// --------------------------------------------
// Keyboard Shortcuts
// --------------------------------------------

document.addEventListener(

    "keydown",

    function (e) {

        if (e.ctrlKey && e.key === "s") {

            e.preventDefault();

            saveEstimate();

        }

        if (e.ctrlKey && e.key === "p") {

            e.preventDefault();

            printEstimate();

        }

        if (e.key === "F5") {

            e.preventDefault();

            calculateVehicleCost();

        }

    }

);

// --------------------------------------------
// Improved Save
// --------------------------------------------

const oldSaveEstimate = saveEstimate;

saveEstimate = async function () {

    await oldSaveEstimate();

    showToast(

        "Estimate saved successfully."

    );

    await loadEstimateHistory();

    await loadVehicleInventory();

    await loadDashboardStats();

};

// --------------------------------------------
// Page Ready
// --------------------------------------------

window.addEventListener(

    "load",

    async () => {

        await loadVehicleInventory();

        await loadCustomerOrders();

        showToast(

            "JJN HUB Automotive System Ready"

        );

    }

);

console.log(

    "Automotive Module Loaded Successfully."

);
