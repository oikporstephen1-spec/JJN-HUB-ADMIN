/*
==========================================================
JJN HUB ERP
Configuration File
Version: 1.0
==========================================================
*/

/*=========================================================
 COMPANY INFORMATION
=========================================================*/

const COMPANY = {

    name: "Jesse & Jeslyn Nigeria Limited",

    shortName: "JJN HUB",

    slogan: "Engineering • Marine • Automotive • Logistics",

    email: "info@jjnhub.com",

    phone: "+234XXXXXXXXXX",

    website: "www.jjnhub.com",

    currency: "NGN",

    vatRate: 0.075

};


/*=========================================================
 DOCUMENT PREFIXES
=========================================================*/

const PREFIX = {

    DOCUMENT: "DOC",

    PR: "PR",

    RFQ: "RFQ",

    PO: "PO",

    QUOTATION: "QT",

    INVOICE: "INV",

    PROJECT: "PRJ",

    ENGINEERING: "ENG",

    AUTOMOTIVE: "AUT",

    MARINE: "MAR",

    PROCUREMENT: "PROC",

    LOGISTICS: "LOG",

    QUALITY: "QMS",

    REPORT: "REP"

};


/*=========================================================
 STORAGE BUCKETS
=========================================================*/

const STORAGE = {

    DOCUMENTS: "documents",

    ENGINEERING: "engineering",

    MARINE: "marine",

    AUTOMOTIVE: "automotive",

    PROCUREMENT: "procurement",

    LOGISTICS: "logistics",

    QUALITY: "quality",

    REPORTS: "reports"

};


/*=========================================================
 DATABASE TABLES
=========================================================*/

const TABLES = {

    USERS: "users",

    CUSTOMERS: "customers",

    DOCUMENTS: "documents",

    DOCUMENT_ITEMS: "document_items",

    DOCUMENT_EXTRACTIONS: "document_extractions",

    DOCUMENT_WORKFLOW: "document_workflow",

    DOCUMENT_AUDIT: "document_audit",

    PROJECTS: "projects",

    ENGINEERING_PROJECTS: "engineering_projects",

    ENGINEERING_ITEMS: "engineering_items",

    QUOTATIONS: "quotations",

    QUOTATION_ITEMS: "quotation_items",

    WORK_ORDERS: "work_orders",

    CONTRACTS: "contracts",

    REPORTS: "reports",

    SETTINGS: "settings"

};


/*=========================================================
 DOCUMENT TYPES
=========================================================*/

const DOCUMENT_TYPES = [

    "Purchase Requisition",

    "Request For Quotation",

    "Purchase Order",

    "Contract",

    "Invoice",

    "Bill of Quantities",

    "Technical Report",

    "Inspection Report",

    "Drawing",

    "Certificate",

    "Manual",

    "Specification",

    "Other"

];


/*=========================================================
 DEPARTMENTS
=========================================================*/

const DEPARTMENTS = [

    "Engineering",

    "Marine",

    "Automotive",

    "Procurement",

    "Logistics",

    "Quality",

    "Finance",

    "Administration"

];


/*=========================================================
 DOCUMENT STATUS
=========================================================*/

const STATUS = {

    DRAFT: "Draft",

    UPLOADED: "Uploaded",

    REVIEW: "Under Review",

    APPROVED: "Approved",

    REJECTED: "Rejected",

    ARCHIVED: "Archived"

};


/*=========================================================
 WORKFLOW STATUS
=========================================================*/

const WORKFLOW = {

    UPLOADED: "Uploaded",

    EXTRACTED: "Extracted",

    REVIEWED: "Reviewed",

    APPROVED: "Approved",

    ESTIMATE: "Cost Estimate",

    QUOTATION: "Quotation",

    WORK_ORDER: "Work Order",

    EXECUTION: "Execution",

    TESTING: "Testing",

    COMPLETED: "Completed",

    INVOICED: "Invoiced",

    CLOSED: "Closed"

};


/*=========================================================
 USER ROLES
=========================================================*/

const ROLES = {

    ADMIN: "Administrator",

    MANAGER: "Manager",

    ENGINEER: "Engineer",

    PROCUREMENT: "Procurement",

    QUALITY: "Quality",

    ACCOUNTS: "Accounts",

    VIEWER: "Viewer"

};


/*=========================================================
 EXPORT TO GLOBAL WINDOW
=========================================================*/

window.COMPANY = COMPANY;

window.PREFIX = PREFIX;

window.STORAGE = STORAGE;

window.TABLES = TABLES;

window.DOCUMENT_TYPES = DOCUMENT_TYPES;

window.DEPARTMENTS = DEPARTMENTS;

window.STATUS = STATUS;

window.WORKFLOW = WORKFLOW;

window.ROLES = ROLES;
