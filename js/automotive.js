// ======================================================
// JJN HUB AUTOMOTIVE MANAGEMENT SYSTEM
// automotive.js
// PART 1 - INITIALIZATION
// ======================================================

// --------------------------------------------
// Supabase
// --------------------------------------------

const supabase = window.supabaseClient;

if (!supabase) {

    console.error("Supabase client not found.");

}

// --------------------------------------------
// Lookup Tables
// --------------------------------------------

let auctionFees = [];
let inlandRates = [];
let shippingRates = [];

// --------------------------------------------
// Form Elements
// --------------------------------------------

const make = document.getElementById("make");
const model = document.getElementById("model");
const year = document.getElementById("year");
const vin = document.getElementById("vin");

const vehicleType = document.getElementById("vehicleType");

const auction = document.getElementById("auction");
const auctionYard = document.getElementById("auctionYard");

const purchasePrice = document.getElementById("purchasePrice");

const auctionFee = document.getElementById("auctionFee");
const buyingCost = document.getElementById("buyingCost");

const buyerType = document.getElementById("buyerType");
const titleType = document.getElementById("titleType");

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

// --------------------------------------------
// Summary Fields
// --------------------------------------------

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

// --------------------------------------------
// Estimate Table
// --------------------------------------------

const estimateTableBody =
document.getElementById("estimateTableBody");

const estimateSearch =
document.getElementById("estimateSearch");

// --------------------------------------------
// Helper Functions
// --------------------------------------------

function num(value) {

    return Number(value || 0);

}

function money(value) {

    return Number(value || 0).toLocaleString(

        undefined,

        {

            minimumFractionDigits:2,

            maximumFractionDigits:2

        }

    );

}

// --------------------------------------------
// Load Database Tables
// --------------------------------------------

async function loadLookupTables() {

    console.log("Loading lookup tables...");

    // Auction Fees

    let { data, error } = await supabase

        .from("auction_fees")

        .select("*");

    if(error){

        console.error(error);

    }else{

        auctionFees = data;

    }

    // Inland Rates

    ({data,error}=await supabase

        .from("inland_rates")

        .select("*"));

    if(error){

        console.error(error);

    }else{

        inlandRates = data;

    }

    // Shipping Rates

    ({data,error}=await supabase

        .from("shipping_rates")

        .select("*"));

    if(error){

        console.error(error);

    }else{

        shippingRates = data;

    }

    console.log(

        "Auction Fees:",auctionFees.length,

        "Inland Rates:",inlandRates.length,

        "Shipping Rates:",shippingRates.length

    );

}
