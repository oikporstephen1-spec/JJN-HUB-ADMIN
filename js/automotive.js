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

// -----------------------------------------------------
// START APPLICATION
// -----------------------------------------------------

window.addEventListener("load", async ()=>{

    await loadLookupTables();

    console.log("Automotive System Ready.");

});

