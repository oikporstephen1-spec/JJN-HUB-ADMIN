/*
=========================================================
JJN HUB ERP
Storage Manager
Version 1.3
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

    maxFileSize: 50 * 1024 * 1024,

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
    VALIDATE FILE
    =========================================================
    */

    validate(file) {

        if (!file) {

            return {

                valid: false,

                message: "No file selected."

            };

        }

        if (!this.allowedTypes.includes(file.type)) {

            return {

                valid: false,

                message: "Unsupported file type."

            };

        }

        if (file.size > this.maxFileSize) {

            return {

                valid: false,

                message: "Maximum upload size is 50 MB."

            };

        }

        return {

            valid: true,

            message: "File validation successful."

        };

    },

    /*
    =========================================================
    FORMAT FILE SIZE
    =========================================================
    */

    formatSize(bytes) {

        if (bytes < 1024)
            return bytes + " B";

        if (bytes < 1024 * 1024)
            return (bytes / 1024).toFixed(2) + " KB";

        if (bytes < 1024 * 1024 * 1024)
            return (bytes / 1024 / 1024).toFixed(2) + " MB";

        return (bytes / 1024 / 1024 / 1024).toFixed(2) + " GB";

    },

    /*
    =========================================================
    FILE ICON
    =========================================================
    */

    getIcon(type = "") {

        type = type.toLowerCase();

        if (type.includes("pdf"))
            return "📄";

        if (type.includes("image"))
            return "🖼️";

        if (type.includes("word"))
            return "📝";

        if (type.includes("excel") || type.includes("sheet"))
            return "📊";

        return "📁";

    },

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
