/*
=========================================================
JJN HUB ERP
Storage Manager
Version 1.0 - Step 1
=========================================================
Requires:
- supabase.js
=========================================================
*/

const StorageManager = {

    /*
    =========================================================
    INITIALIZE
    =========================================================
    */

    init() {

        console.log("Storage Manager Ready");

    }

};

/*
=========================================================
EXPORT
=========================================================
*/

window.StorageManager = StorageManager;

/*
=========================================================
START
=========================================================
*/

StorageManager.init();
/*
=========================================================
JJN HUB ERP
Storage Manager
Version 1.1
=========================================================
Requires:
- supabase.js
=========================================================
*/

const StorageManager = {

    /*
    =========================================================
    CONFIGURATION
    =========================================================
    */

    bucket: STORAGE.DOCUMENTS,

    maxFileSize: 50 * 1024 * 1024, // 50 MB

    allowedTypes: [

        "application/pdf",

        "application/msword",

        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

        "application/vnd.ms-excel",

        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        "image/jpeg",

        "image/png",

        "image/webp"

    ],

    /*
    =========================================================
    INITIALIZE
    =========================================================
    */

    init() {

        console.log("Storage Manager Ready");

        console.log("Bucket:", this.bucket);

    }

};

/*
=========================================================
EXPORT
=========================================================
*/

window.StorageManager = StorageManager;

/*
=========================================================
START
=========================================================
*/

StorageManager.init();
