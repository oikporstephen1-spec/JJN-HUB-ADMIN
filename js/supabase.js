/*
=========================================================
JJN HUB ERP
Supabase Configuration
=========================================================
Author: JJN HUB
Version: 1.0
=========================================================
*/

const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
        auth: {

            autoRefreshToken: true,

            persistSession: true,

            detectSessionInUrl: true

        },

        global: {

            headers: {

                "X-Client-Info": "JJN-HUB-ERP"

            }

        }

    }
);

/*
=========================================================
Storage Buckets
=========================================================
*/

const STORAGE = {

    DOCUMENTS: "documents",

    ENGINEERING: "engineering",

    AUTOMOTIVE: "automotive",

    MARINE: "marine",

    PROCUREMENT: "procurement",

    LOGISTICS: "logistics",

    QUALITY: "quality",

    REPORTS: "reports"

};

/*
=========================================================
Database Tables
=========================================================
*/

const TABLES = {

    USERS: "users",

    CUSTOMERS: "customers",

    DOCUMENTS: "documents",

    DOCUMENT_ITEMS: "document_items",

    DOCUMENT_EXTRACTIONS: "document_extractions",

    DOCUMENT_AUDIT: "document_audit",

    PROJECTS: "projects",

    ENGINEERING_PROJECTS: "engineering_projects",

    ENGINEERING_ITEMS: "engineering_items",

    QUOTATIONS: "quotations",

    QUOTATION_ITEMS: "quotation_items",

    WORK_ORDERS: "work_orders",

    CONTRACTS: "contracts",

    REPORTS: "reports"

};

/*
=========================================================
Authentication
=========================================================
*/

async function getCurrentUser() {

    const {

        data,

        error

    } = await supabase.auth.getUser();

    if (error) {

        console.error(error);

        return null;

    }

    return data.user;

}

/*
=========================================================
Current Session
=========================================================
*/

async function getSession() {

    const {

        data,

        error

    } = await supabase.auth.getSession();

    if (error) {

        console.error(error);

        return null;

    }

    return data.session;

}

/*
=========================================================
Logout
=========================================================
*/

async function logout() {

    await supabase.auth.signOut();

    window.location.href = "login.html";

}

/*
=========================================================
Generate Document Number
=========================================================
*/

function generateDocumentNumber(type) {

    const year = new Date().getFullYear();

    const random = Math.floor(Math.random() * 9000) + 1000;

    return `${type}-${year}-${random}`;

}

/*
=========================================================
Currency Formatter
=========================================================
*/

function formatCurrency(value) {

    return new Intl.NumberFormat("en-NG", {

        style: "currency",

        currency: "NGN"

    }).format(value);

}

/*
=========================================================
Date Formatter
=========================================================
*/

function formatDate(date) {

    return new Date(date).toLocaleDateString("en-GB");

}

/*
=========================================================
Notification
=========================================================
*/

function notify(message, type = "success") {

    console.log(type.toUpperCase(), message);

}

/*
=========================================================
Loading Overlay
=========================================================
*/

function showLoading(message = "Loading...") {

    const overlay = document.getElementById("loadingOverlay");

    if (!overlay) return;

    overlay.style.display = "flex";

    overlay.querySelector("span").textContent = message;

}

function hideLoading() {

    const overlay = document.getElementById("loadingOverlay");

    if (!overlay) return;

    overlay.style.display = "none";

}

/*
=========================================================
Document Types
=========================================================
*/

const DOCUMENT_TYPES = [

    "Purchase Requisition",

    "Request For Quotation",

    "Purchase Order",

    "Contract",

    "Invoice",

    "Technical Report",

    "Inspection Report",

    "Drawing",

    "BOQ",

    "Certificate"

];

/*
=========================================================
Departments
=========================================================
*/

const DEPARTMENTS = [

    "Engineering",

    "Marine",

    "Automotive",

    "Logistics",

    "Procurement",

    "Quality",

    "Finance"

];

/*
=========================================================
Workflow Status
=========================================================
*/

const WORKFLOW = {

    DRAFT: "Draft",

    UPLOADED: "Uploaded",

    EXTRACTED: "Extracted",

    REVIEW: "Review",

    APPROVED: "Approved",

    QUOTATION: "Quotation",

    WORK_ORDER: "Work Order",

    COMPLETED: "Completed",

    ARCHIVED: "Archived"

};

/*
=========================================================
Export Globals
=========================================================
*/

window.supabaseClient = supabase;

window.STORAGE = STORAGE;

window.TABLES = TABLES;

window.WORKFLOW = WORKFLOW;

window.DOCUMENT_TYPES = DOCUMENT_TYPES;

window.DEPARTMENTS = DEPARTMENTS;

window.generateDocumentNumber = generateDocumentNumber;

window.formatCurrency = formatCurrency;

window.formatDate = formatDate;

window.notify = notify;

window.showLoading = showLoading;

window.hideLoading = hideLoading;

window.getCurrentUser = getCurrentUser;

window.getSession = getSession;

window.logoutUser = logout;
