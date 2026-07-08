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
    GET FILE EXTENSION
    =========================================================
    */

    getExtension(filename) {

        return filename.split(".").pop().toLowerCase();

    },



    /*
    =========================================================
    GENERATE UNIQUE FILE NAME
    =========================================================
    */

    generateFileName(file, prefix = "DOC") {

        const ext = this.getExtension(file.name);

        const timestamp = Date.now();

        const random = Math.floor(Math.random() * 9000) + 1000;

        return `${prefix}_${timestamp}_${random}.${ext}`;

    },



    /*
    =========================================================
    BUILD STORAGE FOLDER
    =========================================================
    */

    buildFolder(department = "General") {

        const year = new Date().getFullYear();

        const month = String(

            new Date().getMonth() + 1

        ).padStart(2, "0");

        return `${department.toLowerCase()}/${year}/${month}`;

    },



    /*
    =========================================================
    BUILD STORAGE PATH
    =========================================================
    */

    buildStoragePath(file, department = "General", prefix = "DOC") {

        return `${

            this.buildFolder(department)

        }/${

            this.generateFileName(file, prefix)

        }`;

    },
    /*
=========================================================
CHECK STORAGE CONNECTION
=========================================================
*/

async checkConnection() {

    try {

        const { data, error } = await window.supabaseClient.storage
            .from(this.bucket)
            .list("", {
                limit: 1
            });

        if (error)
            throw error;

        console.log("✅ Storage connection successful.");

        return true;

    }

    catch (err) {

        console.error(err);

        notify(err.message, "error");

        return false;

    }

},
/*
=========================================================
UPLOAD FILE TO SUPABASE STORAGE
=========================================================
*/

async uploadFile(file, department = "General") {

    try {

        /*
        -------------------------------
        Validate file
        -------------------------------
        */

        const result = this.validate(file);

        if (!result.valid) {

            notify(result.message, "error");

            return null;

        }

        /*
        -------------------------------
        Build Storage Path
        -------------------------------
        */

        const storagePath = this.buildStoragePath(

            file,

            department,

            PREFIX.DOCUMENT

        );

        /*
        -------------------------------
        Upload to Supabase
        -------------------------------
        */

        const { data, error } = await window.supabaseClient
            .storage
            .from(this.bucket)
            .upload(

                storagePath,

                file,

                {

                    cacheControl: "3600",

                    upsert: false

                }

            );

        if (error) {

            throw error;

        }

        notify(

            "Upload Successful",

            "success"

        );

        console.log(data);

        return {

            success: true,

            path: storagePath,

            data

        };

    }

    catch (err) {

        console.error(err);

        notify(

            err.message,

            "error"

        );

        return null;

    }

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
