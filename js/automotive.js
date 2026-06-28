// ===============================
// JJN HUB Vehicle Cost Calculator
// automotive.js
// ===============================

const $ = id => document.getElementById(id);

// Calculate Vehicle Cost
function calculateVehicleCost(){

    const purchase =
    Number($("purchasePrice").value) || 0;

    const auction =
    Number($("auctionFee").value) || 0;

    const inland =
    Number($("inlandTransport").value) || 0;

    const freight =
    Number($("shippingCost").value) || 0;

    const insurance =
    Number($("insurance").value) || 0;

    const documentation =
    Number($("documentation").value) || 0;

    const exchange =
    Number($("exchangeRate").value) || 0;

    const clearing =
    Number($("clearingCost").value) || 0;

    const other =
    Number($("otherCost").value) || 0;

    const profit =
    Number($("profit").value) || 0;

    // Total USD

    const totalUSD =
        purchase +
        auction +
        inland +
        freight +
        insurance +
        documentation;

    // Convert to Naira

    const nairaCost =
        totalUSD * exchange;

    // Landed Cost

    const landedCost =
        nairaCost +
        clearing +
        other;

    // Selling Price

    const sellingPrice =
        landedCost +
        profit;

    // Display

    $("usdTotal").innerHTML =
        "$" +
        totalUSD.toLocaleString();

    $("nairaTotal").innerHTML =
        "₦" +
        landedCost.toLocaleString();

    $("sellingPrice").innerHTML =
        "₦" +
        sellingPrice.toLocaleString();
}


// Reset Form

function resetCalculator(){

    document
    .querySelectorAll(".cost-input")
    .forEach(input=>{

        input.value="";

    });

    $("usdTotal").innerHTML="$0";

    $("nairaTotal").innerHTML="₦0";

    $("sellingPrice").innerHTML="₦0";

}


// Print Estimate

function printEstimate(){

    window.print();

}


// Save Estimate

async function saveEstimate(){

    if(!window.supabaseClient){

        alert("Supabase not connected.");

        return;

    }

    const estimate={

        vehicle_make:
        $("make").value,

        vehicle_model:
        $("model").value,

        vehicle_year:
        $("year").value,

        vin:
        $("vin").value,

        purchase_price:
        $("purchasePrice").value,

        auction_fee:
        $("auctionFee").value,

        inland_transport:
        $("inlandTransport").value,

        shipping_cost:
        $("shippingCost").value,

        insurance:
        $("insurance").value,

        documentation:
        $("documentation").value,

        exchange_rate:
        $("exchangeRate").value,

        clearing_cost:
        $("clearingCost").value,

        other_cost:
        $("otherCost").value,

        profit:
        $("profit").value,

        total_usd:
        $("usdTotal").innerText,

        landed_cost:
        $("nairaTotal").innerText,

        selling_price:
        $("sellingPrice").innerText

    };

    const {error}=await
    window.supabaseClient
    .from("vehicle_estimates")
    .insert([estimate]);

    if(error){

        alert(error.message);

        return;

    }

    alert("Estimate Saved Successfully");

}


// Email Estimate

async function emailEstimate(){

    const email=
    prompt("Customer Email");

    if(!email){

        return;

    }

    const response=
    await fetch(
    "https://aosewocqcpoffckmnfpn.supabase.co/functions/v1/send-invoice",
    {

        method:"POST",

        headers:{

            "Content-Type":
            "application/json"

        },

        body:JSON.stringify({

            email:email,

            invoiceNumber:
            "Vehicle Estimate",

            description:

`
Vehicle Estimate

${$("make").value}

${$("model").value}

${$("year").value}

Selling Price:

${$("sellingPrice").innerText}
            `,

            total:
            $("sellingPrice")
            .innerText

        })

    });

    if(response.ok){

        alert("Estimate Sent");

    }

    else{

        alert("Email Failed");

    }

}


// Make functions global

window.calculateVehicleCost=
calculateVehicleCost;

window.resetCalculator=
resetCalculator;

window.printEstimate=
printEstimate;

window.saveEstimate=
saveEstimate;

window.emailEstimate=
emailEstimate;
