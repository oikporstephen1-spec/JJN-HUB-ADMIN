/*=========================================
JJN HUB Automotive Calculator
Part 1
=========================================*/

//==============================
// DOM Helpers
//==============================

const $ = (id) => document.getElementById(id);

//==============================
// Form Controls
//==============================

const auction = $("auction");
const auctionYard = $("auctionYard");
const purchasePrice = $("purchasePrice");

const buyingCost = $("buyingCost");
const auctionFee = $("auctionFee");

const destinationCountry = $("destinationCountry");
const destinationPort = $("destinationPort");
const shippingType = $("shippingType");

const loadingPort = $("loadingPort");
const inlandTransport = $("inlandTransport");
const shippingCost = $("shippingCost");
const insurance = $("insurance");
const documentation = $("documentation");
const portHandling = $("portHandling");
const terminalStorage = $("terminalStorage");
const totalShipping = $("totalShipping");

const exchangeRate = $("exchangeRate");
const customDuty = $("customDuty");
const clearingCost = $("clearingCost");
const deliveryCost = $("deliveryCost");
const otherCost = $("otherCost");
const profit = $("profit");

const buyingCostDisplay = $("buyingCostDisplay");
const shippingCostDisplay = $("shippingCostDisplay");
const usdTotal = $("usdTotal");
const nairaTotal = $("nairaTotal");
const sellingPrice = $("sellingPrice");

//==============================
// Configuration
//==============================

// Temporary values.
// Later these will come from Supabase.

const CONFIG = {

    documentationFee:85,

    portHandling:120,

    terminalStorage:50,

    insurancePercent:0.015

};

//==============================
// Auction Fee Rules
//==============================

// Temporary estimates.
// Later replace with official
// Copart / IAAI fee schedule.

const auctionFeePercent={

    Copart:0.12,

    IAAI:0.10,

    Dealer:0,

    "Private Seller":0

};

//==============================
// Auction Yard Information
//==============================

const auctionYards={

    "New Jersey":{

        loadingPort:"Newark",

        inland:150

    },

    "New York":{

        loadingPort:"New York",

        inland:180

    },

    Baltimore:{

        loadingPort:"Baltimore",

        inland:250

    },

    Savannah:{

        loadingPort:"Savannah",

        inland:220

    },

    Jacksonville:{

        loadingPort:"Jacksonville",

        inland:240

    },

    Atlanta:{

        loadingPort:"Savannah",

        inland:320

    },

    Houston:{

        loadingPort:"Houston",

        inland:450

    },

    Chicago:{

        loadingPort:"Chicago",

        inland:420

    },

    Dallas:{

        loadingPort:"Houston",

        inland:480

    },

    Miami:{

        loadingPort:"Miami",

        inland:200

    },

    "Los Angeles":{

        loadingPort:"Los Angeles",

        inland:120

    },

    Tacoma:{

        loadingPort:"Tacoma",

        inland:100

    }

};

//==============================
// Shipping Rates
//==============================

// Temporary estimates.
// Later these should come
// from Supabase.

const shippingRates={

    Newark:{
        RoRo:950,
        Container:1800
    },

    Baltimore:{
        RoRo:980,
        Container:1850
    },

    Savannah:{
        RoRo:1000,
        Container:1900
    },

    Jacksonville:{
        RoRo:1025,
        Container:1925
    },

    Houston:{
        RoRo:1250,
        Container:2150
    },

    Miami:{
        RoRo:1050,
        Container:1950
    },

    "Los Angeles":{
        RoRo:1600,
        Container:2500
    },

    Tacoma:{
        RoRo:1700,
        Container:2600
    },

    "New York":{
        RoRo:975,
        Container:1825
    },

    Chicago:{
        RoRo:1100,
        Container:2000
    }

};

//==============================
// Utilities
//==============================

function num(value){

    return Number(value)||0;

}

function money(value){

    return Number(value).toLocaleString(
        undefined,
        {
            minimumFractionDigits:2,
            maximumFractionDigits:2
        }
    );

}

//==============================
// Event Listeners
//==============================

auction.addEventListener(
"change",
calculateVehicleCost
);

auctionYard.addEventListener(
"change",
calculateVehicleCost
);

purchasePrice.addEventListener(
"input",
calculateVehicleCost
);

shippingType.addEventListener(
"change",
calculateVehicleCost
);

exchangeRate.addEventListener(
"input",
calculateVehicleCost
);

customDuty.addEventListener(
"input",
calculateVehicleCost
);

clearingCost.addEventListener(
"input",
calculateVehicleCost
);

deliveryCost.addEventListener(
"input",
calculateVehicleCost
);

otherCost.addEventListener(
"input",
calculateVehicleCost
);

profit.addEventListener(
"input",
calculateVehicleCost
);
/*=========================================
JJN HUB Automotive Calculator
Part 2
Calculation Engine
=========================================*/

function calculateVehicleCost(){

    //-------------------------------------
    // Purchase Price
    //-------------------------------------

    const price = num(purchasePrice.value);

    //-------------------------------------
    // Auction Fee
    //-------------------------------------

    const fee =
calculateAuctionFee(price);
    auctionFee.value =
        fee.toFixed(2);

    //-------------------------------------
    // Buying Cost
    //-------------------------------------

    const buying =
        price + fee;

    buyingCost.value =
        buying.toFixed(2);

    buyingCostDisplay.innerHTML =
        "$" + money(buying);

    //-------------------------------------
    // Auction Yard
    //-------------------------------------

    const yard =
        auctionYards[
            auctionYard.value
        ];

    let inland = 0;

    let loadPort = "";

    if(yard){

        inland =
            yard.inland;

        loadPort =
            yard.loadingPort;

    }

    loadingPort.value =
        loadPort;

    inlandTransport.value =
        inland.toFixed(2);

    //-------------------------------------
    // Shipping
    //-------------------------------------

    let freight = 0;

    if(
        shippingRates[
            loadPort
        ]
    ){

        freight =
        shippingRates[
            loadPort
        ][
            shippingType.value
        ] || 0;

    }

    shippingCost.value =
        freight.toFixed(2);

    //-------------------------------------
    // Insurance
    //-------------------------------------

    const insure =
        buying *
        CONFIG.insurancePercent;

    insurance.value =
        insure.toFixed(2);

    //-------------------------------------
    // Documentation
    //-------------------------------------

    documentation.value =
        CONFIG.documentationFee.toFixed(2);

    //-------------------------------------
    // Port Handling
    //-------------------------------------

    portHandling.value =
        CONFIG.portHandling.toFixed(2);

    //-------------------------------------
    // Terminal Storage
    //-------------------------------------

    terminalStorage.value =
        CONFIG.terminalStorage.toFixed(2);

    //-------------------------------------
    // Total Shipping
    //-------------------------------------

    const shippingTotal =

        inland +

        freight +

        insure +

        CONFIG.documentationFee +

        CONFIG.portHandling +

        CONFIG.terminalStorage;

    totalShipping.value =
        shippingTotal.toFixed(2);

    shippingCostDisplay.innerHTML =
        "$" +
        money(
            shippingTotal
        );

    //-------------------------------------
    // Total USD
    //-------------------------------------

    const usd =

        buying +

        shippingTotal;

    usdTotal.innerHTML =
        "$" +
        money(usd);

    //-------------------------------------
    // Convert to Naira
    //-------------------------------------

    const rate =
        num(
            exchangeRate.value
        );

    const usdToNaira =
        usd * rate;

    //-------------------------------------
    // Nigeria Costs
    //-------------------------------------

    const customs =
        num(
            customDuty.value
        );

    const clearing =
        num(
            clearingCost.value
        );

    const delivery =
        num(
            deliveryCost.value
        );

    const other =
        num(
            otherCost.value
        );

    //-------------------------------------
    // Landed Cost
    //-------------------------------------

    const landed =

        usdToNaira +

        customs +

        clearing +

        delivery +

        other;

    nairaTotal.innerHTML =
        "₦" +
        money(
            landed
        );

    //-------------------------------------
    // Selling Price
    //-------------------------------------

    const sell =

        landed +

        num(
            profit.value
        );

    sellingPrice.innerHTML =
        "₦" +
        money(
            sell
        );

}
/*=========================================
JJN HUB Automotive Calculator
Part 3
Auction Fee Schedule
=========================================*/

//------------------------------------------
// COPART AUCTION FEES
//------------------------------------------

function getCopartFee(price){

    if(price<=99) return 25;
    if(price<=199) return 60;
    if(price<=299) return 85;
    if(price<=349) return 100;
    if(price<=399) return 110;
    if(price<=499) return 125;
    if(price<=749) return 160;
    if(price<=999) return 205;
    if(price<=1499) return 255;
    if(price<=1999) return 305;
    if(price<=3999) return 420;
    if(price<=5999) return 520;
    if(price<=7999) return 620;
    if(price<=9999) return 720;

    return price*0.08;

}

//------------------------------------------
// IAAI AUCTION FEES
//------------------------------------------

function getIAAIFee(price){

    if(price<=99) return 20;
    if(price<=199) return 50;
    if(price<=299) return 70;
    if(price<=399) return 90;
    if(price<=499) return 105;
    if(price<=749) return 145;
    if(price<=999) return 185;
    if(price<=1499) return 235;
    if(price<=1999) return 285;
    if(price<=3999) return 395;
    if(price<=5999) return 495;
    if(price<=7999) return 595;
    if(price<=9999) return 695;

    return price*0.075;

}

//------------------------------------------
// Dealer Fees
//------------------------------------------

function getDealerFee(price){

    return 0;

}

//------------------------------------------
// Private Seller Fees
//------------------------------------------

function getPrivateSellerFee(price){

    return 0;

}

//------------------------------------------
// Master Fee Function
//------------------------------------------

function calculateAuctionFee(price){

    switch(auction.value){

        case "Copart":

            return getCopartFee(price);

        case "IAAI":

            return getIAAIFee(price);

        case "Dealer":

            return getDealerFee(price);

        case "Private Seller":

            return getPrivateSellerFee(price);

        default:

            return 0;

    }

}
/*=========================================
JJN HUB Automotive Calculator
Part 4
Utilities
=========================================*/

//------------------------------------------
// Reset Calculator
//------------------------------------------

function resetCalculator(){

    document
    .getElementById("vehicleCalculator")
    .reset();

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

    buyingCostDisplay.innerHTML="$0.00";
    shippingCostDisplay.innerHTML="$0.00";
    usdTotal.innerHTML="$0.00";
    nairaTotal.innerHTML="₦0.00";
    sellingPrice.innerHTML="₦0.00";

}

//------------------------------------------
// Print Estimate
//------------------------------------------

function printEstimate(){

    window.print();

}

//------------------------------------------
// Email Estimate
//------------------------------------------

function emailEstimate(){

    const subject="JJN HUB Vehicle Import Estimate";

    const body=`

JJN HUB VEHICLE IMPORT ESTIMATE

Vehicle:
${$("make").value} ${$("model").value}

Year:
${$("year").value}

Auction:
${auction.value}

Auction Yard:
${auctionYard.value}

Buying Cost:
${buyingCostDisplay.innerText}

Shipping Cost:
${shippingCostDisplay.innerText}

Landed Cost:
${nairaTotal.innerText}

Recommended Selling Price:
${sellingPrice.innerText}

Generated by JJN HUB
`;

    window.location.href=

`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

}

//------------------------------------------
// Save Estimate
//------------------------------------------

function saveEstimate(){

    const estimate={

        make:$("make").value,

        model:$("model").value,

        year:$("year").value,

        vin:$("vin").value,

        vehicleType:$("vehicleType").value,

        auction:auction.value,

        auctionYard:auctionYard.value,

        purchasePrice:purchasePrice.value,

        auctionFee:auctionFee.value,

        buyingCost:buyingCost.value,

        loadingPort:loadingPort.value,

        inlandTransport:inlandTransport.value,

        shippingCost:shippingCost.value,

        insurance:insurance.value,

        documentation:documentation.value,

        portHandling:portHandling.value,

        terminalStorage:terminalStorage.value,

        totalShipping:totalShipping.value,

        exchangeRate:exchangeRate.value,

        customs:customDuty.value,

        clearing:clearingCost.value,

        delivery:deliveryCost.value,

        other:otherCost.value,

        profit:profit.value,

        landedCost:nairaTotal.innerText,

        sellingPrice:sellingPrice.innerText,

        created:new Date().toISOString()

    };

    localStorage.setItem(

        "lastVehicleEstimate",

        JSON.stringify(estimate)

    );

    alert("Estimate saved successfully.");

}

//------------------------------------------
// Load Last Estimate
//------------------------------------------

function loadLastEstimate(){

    const saved=

    localStorage.getItem(
        "lastVehicleEstimate"
    );

    if(!saved){

        return;

    }

    const data=

    JSON.parse(saved);

    $("make").value=data.make||"";
    $("model").value=data.model||"";
    $("year").value=data.year||"";
    $("vin").value=data.vin||"";

    $("vehicleType").value=data.vehicleType||"";

    auction.value=data.auction||"";

    auctionYard.value=data.auctionYard||"";

    purchasePrice.value=data.purchasePrice||"";

    exchangeRate.value=data.exchangeRate||"";

    customDuty.value=data.customs||"";

    clearingCost.value=data.clearing||"";

    deliveryCost.value=data.delivery||"";

    otherCost.value=data.other||"";

    profit.value=data.profit||"";

    calculateVehicleCost();

}

//------------------------------------------
// Page Startup
//------------------------------------------

window.addEventListener(

"load",

function(){

    loadLastEstimate();

    calculateVehicleCost();

}

);
