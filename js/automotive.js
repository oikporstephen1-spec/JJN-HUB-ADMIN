// ======================================
// JJN HUB AUTOMOTIVE CALCULATOR
// PART 1 - SUPABASE & INITIALIZATION
// ======================================

// ----------------------------
// Supabase
// ----------------------------

const supabase = window.supabaseClient;

// ----------------------------
// Form Elements
// ----------------------------

const auction = document.getElementById("auction");
const auctionYard = document.getElementById("auctionYard");
const destinationPort = document.getElementById("destinationPort");
const shippingType = document.getElementById("shippingType");

const purchasePrice = document.getElementById("purchasePrice");
const exchangeRate = document.getElementById("exchangeRate");

const auctionFee = document.getElementById("auctionFee");
const buyingCost = document.getElementById("buyingCost");

const loadingPort = document.getElementById("loadingPort");
const inlandTransport = document.getElementById("inlandTransport");

const shippingCost = document.getElementById("shippingCost");
const insurance = document.getElementById("insurance");
const documentation = document.getElementById("documentation");
const portHandling = document.getElementById("portHandling");
const terminalStorage = document.getElementById("terminalStorage");

const totalShipping = document.getElementById("totalShipping");

const clearingCost = document.getElementById("clearingCost");
const otherCost = document.getElementById("otherCost");
const desiredProfit = document.getElementById("profit");

const usdTotal = document.getElementById("usdTotal");
const nairaTotal = document.getElementById("nairaTotal");
const sellingPrice = document.getElementById("sellingPrice");

// ----------------------------
// Cached Database Records
// ----------------------------

let auctionFees = [];
let inlandRates = [];
let shippingRates = [];

// ----------------------------
// Load Database
// ----------------------------

async function loadDatabase() {

    // Auction Fees

    let { data, error } = await supabase
        .from("auction_fees")
        .select("*");

    if (error) {

        console.error(error);

    } else {

        auctionFees = data;

    }

    // Inland Rates

    ({ data, error } = await supabase
        .from("inland_rates")
        .select("*"));

    if (error) {

        console.error(error);

    } else {

        inlandRates = data;

    }

    // Shipping Rates

    ({ data, error } = await supabase
        .from("shipping_rates")
        .select("*"));

    if (error) {

        console.error(error);

    } else {

        shippingRates = data;

    }

    console.log("Auction Fees:", auctionFees.length);
    console.log("Inland Rates:", inlandRates.length);
    console.log("Shipping Rates:", shippingRates.length);

}

// ----------------------------
// Utility
// ----------------------------

function money(value) {

    return Number(value || 0).toLocaleString(undefined, {

        minimumFractionDigits: 2,

        maximumFractionDigits: 2

    });

}

function number(id) {

    return Number(document.getElementById(id).value) || 0;

}

// ----------------------------
// Page Startup
// ----------------------------

window.addEventListener("load", async () => {

    await loadDatabase();

    console.log("Automotive Calculator Ready");

});
// ======================================
// PART 2 - DATABASE LOOKUPS
// ======================================

// ----------------------------
// Auction Fee Lookup
// ----------------------------

function getAuctionFee(price) {

    const row = auctionFees.find(item =>

        item.auction_house === auction.value &&
        price >= Number(item.min_price) &&
        price <= Number(item.max_price)

    );

    return row ? Number(row.fee) : 0;

}

// ----------------------------
// Inland Transport Lookup
// ----------------------------

function getInlandRate() {

    const row = inlandRates.find(item =>

        item.auction_house === auction.value &&
        item.auction_yard === auctionYard.value

    );

    if (!row) {

        loadingPort.value = "";
        inlandTransport.value = "0";

        return;

    }

    loadingPort.value = row.loading_port;

    inlandTransport.value = Number(
        row.inland_cost
    ).toFixed(2);

}

// ----------------------------
// Shipping Lookup
// ----------------------------

function getShippingRate() {

    const row = shippingRates.find(item =>

        item.loading_port === loadingPort.value &&
        item.destination_port === destinationPort.value &&
        item.shipping_type === shippingType.value

    );

    if (!row) {

        shippingCost.value = "0";
        insurance.value = "0";
        documentation.value = "0";
        portHandling.value = "0";
        terminalStorage.value = "0";
        totalShipping.value = "0";

        return;

    }

    shippingCost.value = Number(
        row.freight
    ).toFixed(2);

    insurance.value = Number(
        row.insurance
    ).toFixed(2);

    documentation.value = Number(
        row.documentation
    ).toFixed(2);

    portHandling.value = Number(
        row.port_handling
    ).toFixed(2);

    terminalStorage.value = Number(
        row.terminal_storage
    ).toFixed(2);

    const shippingTotal =

        Number(row.freight) +
        Number(row.insurance) +
        Number(row.documentation) +
        Number(row.port_handling) +
        Number(row.terminal_storage);

    totalShipping.value = shippingTotal.toFixed(2);

}

// ----------------------------
// Refresh All Rates
// ----------------------------

function refreshRates() {

    const price = number("purchasePrice");

    auctionFee.value = getAuctionFee(price).toFixed(2);

    buyingCost.value = (

        price +

        Number(auctionFee.value)

    ).toFixed(2);

    getInlandRate();

    getShippingRate();

}

// ----------------------------
// Auto Refresh
// ----------------------------

auction.addEventListener("change", refreshRates);

auctionYard.addEventListener("change", refreshRates);

destinationPort.addEventListener("change", refreshRates);

shippingType.addEventListener("change", refreshRates);

purchasePrice.addEventListener("input", refreshRates);
// ======================================
// PART 3 - CALCULATIONS
// ======================================

// ----------------------------
// Main Calculator
// ----------------------------

function calculateVehicleCost() {

    refreshRates();

    // USD VALUES

    const buying = number("buyingCost");

    const inland = number("inlandTransport");

    const freight = number("shippingCost");

    const insure = number("insurance");

    const docs = number("documentation");

    const handling = number("portHandling");

    const storage = number("terminalStorage");

    // SHIPPING TOTAL

    const shippingTotal =

        inland +
        freight +
        insure +
        docs +
        handling +
        storage;

    totalShipping.value = shippingTotal.toFixed(2);

    // GRAND USD

    const totalUSD =

        buying +
        shippingTotal;

    usdTotal.innerHTML =
        "$" + money(totalUSD);

    // NIGERIA VALUES

    const rate = number("exchangeRate");

    const clearing = number("clearingCost");

    const other = number("otherCost");

    const profit = number("profit");

    // LANDED COST

    const landed =

        (totalUSD * rate) +

        clearing +

        other;

    nairaTotal.innerHTML =
        "₦" + money(landed);

    // SELLING PRICE

    const selling =

        landed +

        profit;

    sellingPrice.innerHTML =
        "₦" + money(selling);

}

// ----------------------------
// Live Calculation
// ----------------------------

exchangeRate.addEventListener(

    "input",

    calculateVehicleCost

);

clearingCost.addEventListener(

    "input",

    calculateVehicleCost

);

otherCost.addEventListener(

    "input",

    calculateVehicleCost

);

desiredProfit.addEventListener(

    "input",

    calculateVehicleCost

);

// ----------------------------
// Calculate Button
// ----------------------------

window.calculateVehicleCost =
calculateVehicleCost;

// ----------------------------
// First Calculation
// ----------------------------

setTimeout(() => {

    calculateVehicleCost();

},1000);
// ======================================
// PART 4 - SUPABASE ESTIMATES
// ======================================

// ----------------------------
// Save Estimate
// ----------------------------

async function saveEstimate() {

    const estimate = {

        make: document.getElementById("make").value,

        model: document.getElementById("model").value,

        year: Number(document.getElementById("year").value),

        vin: document.getElementById("vin").value,

        vehicle_type: document.getElementById("vehicleType").value,

        auction_house: auction.value,

        auction_yard: auctionYard.value,

        purchase_price: number("purchasePrice"),

        auction_fee: number("auctionFee"),

        buying_cost: number("buyingCost"),

        loading_port: loadingPort.value,

        inland_transport: number("inlandTransport"),

        shipping_cost: number("shippingCost"),

        insurance: number("insurance"),

        documentation: number("documentation"),

        port_handling: number("portHandling"),

        terminal_storage: number("terminalStorage"),

        total_shipping: number("totalShipping"),

        exchange_rate: number("exchangeRate"),

        clearing: number("clearingCost"),

        other_cost: number("otherCost"),

        desired_profit: number("profit"),

        landed_cost: parseFloat(
            nairaTotal.innerText
                .replace("₦","")
                .replace(/,/g,"")
        ),

        selling_price: parseFloat(
            sellingPrice.innerText
                .replace("₦","")
                .replace(/,/g,"")
        )

    };

    const { error } = await supabase

        .from("vehicle_estimates")

        .insert([estimate]);

    if(error){

        alert(error.message);

        return;

    }

    alert("Estimate Saved Successfully.");

    loadEstimateHistory();

}

// ----------------------------
// Load Estimates
// ----------------------------

async function loadEstimateHistory(){

    const { data, error } = await supabase

        .from("vehicle_estimates")

        .select("*")

        .order("id",{ascending:false});

    if(error){

        console.log(error);

        return;

    }

    console.table(data);

}

// ----------------------------
// Delete Estimate
// ----------------------------

async function deleteEstimate(id){

    if(!confirm("Delete this estimate?")){

        return;

    }

    const { error } = await supabase

        .from("vehicle_estimates")

        .delete()

        .eq("id",id);

    if(error){

        alert(error.message);

        return;

    }

    loadEstimateHistory();

}

// ----------------------------
// Reset Calculator
// ----------------------------

function resetCalculator(){

    document.getElementById("vehicleCalculator").reset();

    auctionFee.value="";

    buyingCost.value="";

    loadingPort.value="";

    inlandTransport.value="";

    shippingCost.value="";

    insurance.value="";

    documentation.value="";

    portHandling.value="";

    terminalStorage.value="";

    totalShipping.value="";

    usdTotal.innerHTML="$0.00";

    nairaTotal.innerHTML="₦0.00";

    sellingPrice.innerHTML="₦0.00";

}

// ----------------------------
// Expose Functions
// ----------------------------

window.saveEstimate = saveEstimate;

window.deleteEstimate = deleteEstimate;

window.resetCalculator = resetCalculator;

// ----------------------------
// Initial Load
// ----------------------------

loadEstimateHistory();
// ======================================
// PART 5 - PRINT, EMAIL & HISTORY
// ======================================

// ----------------------------
// Print Estimate
// ----------------------------

function printEstimate() {

    const win = window.open("", "_blank");

    win.document.write(`

    <html>

    <head>

    <title>JJN HUB Vehicle Estimate</title>

    <style>

    body{
        font-family:Arial;
        padding:40px;
        line-height:1.8;
    }

    h1{
        color:#d4a017;
    }

    table{
        width:100%;
        border-collapse:collapse;
        margin-top:20px;
    }

    td,th{
        border:1px solid #ddd;
        padding:10px;
    }

    th{
        background:#000;
        color:#fff;
    }

    </style>

    </head>

    <body>

    <h1>JJN HUB</h1>

    <h2>Vehicle Import Cost Estimate</h2>

    <table>

    <tr>

    <th>Description</th>

    <th>Value</th>

    </tr>

    <tr>

    <td>Vehicle</td>

    <td>

    ${make.value}

    ${model.value}

    ${year.value}

    </td>

    </tr>

    <tr>

    <td>VIN</td>

    <td>${vin.value}</td>

    </tr>

    <tr>

    <td>Auction</td>

    <td>${auction.value}</td>

    </tr>

    <tr>

    <td>Buying Cost</td>

    <td>$${money(number("buyingCost"))}</td>

    </tr>

    <tr>

    <td>Total Shipping</td>

    <td>$${money(number("totalShipping"))}</td>

    </tr>

    <tr>

    <td>Total Landed Cost</td>

    <td>${nairaTotal.innerHTML}</td>

    </tr>

    <tr>

    <td>Recommended Selling Price</td>

    <td>${sellingPrice.innerHTML}</td>

    </tr>

    </table>

    </body>

    </html>

    `);

    win.document.close();

    win.print();

}

// ----------------------------
// Email Estimate
// ----------------------------

async function emailEstimate(){

    const email = prompt("Customer Email");

    if(!email) return;

    const response = await fetch(

        "https://YOUR-PROJECT.supabase.co/functions/v1/send-estimate",

        {

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                email,

                vehicle:

                `${make.value}
                 ${model.value}
                 ${year.value}`,

                landed:

                nairaTotal.innerHTML,

                selling:

                sellingPrice.innerHTML

            })

        }

    );

    if(response.ok){

        alert("Estimate emailed successfully.");

    }else{

        alert("Unable to send email.");

    }

}

// ----------------------------
// Search Estimates
// ----------------------------

async function searchEstimate(keyword){

    const {data,error}=await supabase

    .from("vehicle_estimates")

    .select("*")

    .or(

`make.ilike.%${keyword}%,
model.ilike.%${keyword}%,
vin.ilike.%${keyword}%`

    );

    if(error){

        console.log(error);

        return;

    }

    console.table(data);

}

// ----------------------------
// Open Estimate
// ----------------------------

async function openEstimate(id){

const {data,error}=await supabase

.from("vehicle_estimates")

.select("*")

.eq("id",id)

.single();

if(error){

alert(error.message);

return;

}

document.getElementById("make").value=data.make;

document.getElementById("model").value=data.model;

document.getElementById("year").value=data.year;

document.getElementById("vin").value=data.vin;

auction.value=data.auction_house;

auctionYard.value=data.auction_yard;

purchasePrice.value=data.purchase_price;

exchangeRate.value=data.exchange_rate;

clearingCost.value=data.clearing;

otherCost.value=data.other_cost;

desiredProfit.value=data.desired_profit;

calculateVehicleCost();

}

// ----------------------------
// Export
// ----------------------------

window.printEstimate=printEstimate;

window.emailEstimate=emailEstimate;

window.searchEstimate=searchEstimate;

window.openEstimate=openEstimate;
// ======================================
// PART 6 - ESTIMATE HISTORY TABLE
// ======================================

const estimateTableBody =
document.getElementById(
"estimateTableBody"
);

const estimateSearch =
document.getElementById(
"estimateSearch"
);

// ----------------------------
// Load Estimate History
// ----------------------------

async function loadEstimateHistory(){

const {data,error}=await supabase

.from("vehicle_estimates")

.select("*")

.order("id",{ascending:false});

if(error){

console.log(error);

return;

}

displayEstimateTable(data);

}

// ----------------------------
// Display Table
// ----------------------------

function displayEstimateTable(data){

estimateTableBody.innerHTML="";

data.forEach(item=>{

estimateTableBody.innerHTML+=`

<tr>

<td>${item.id}</td>

<td>

${item.make}

${item.model}

${item.year}

</td>

<td>

${item.auction_house}

</td>

<td>

$${money(item.purchase_price)}

</td>

<td>

₦${money(item.landed_cost)}

</td>

<td>

₦${money(item.selling_price)}

</td>

<td>

${new Date(item.created_at).toLocaleDateString()}

</td>

<td>

<button
class="action-btn"
onclick="openEstimate(${item.id})">

View

</button>

<button
class="action-btn"
onclick="printEstimate()">

Print

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

// ----------------------------
// Search
// ----------------------------

estimateSearch.addEventListener(

"input",

async ()=>{

const keyword=
estimateSearch.value;

if(keyword===""){

loadEstimateHistory();

return;

}

const {data,error}=await supabase

.from("vehicle_estimates")

.select("*")

.or(

`make.ilike.%${keyword}%,
model.ilike.%${keyword}%,
vin.ilike.%${keyword}%,
auction_house.ilike.%${keyword}%`

);

if(error){

console.log(error);

return;

}

displayEstimateTable(data);

}

);

// ----------------------------
// Refresh Every Save/Delete
// ----------------------------

window.loadEstimateHistory=
loadEstimateHistory;

loadEstimateHistory();
