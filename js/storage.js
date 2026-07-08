/*
=========================================================
JJN HUB ERP
Storage Manager
Part 1.1
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

                message: "Please select a file."

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

            message: "OK"

        };

    },

    /*
    =========================================================
    FILE NAME
    =========================================================
    */

    sanitizeFileName(filename) {

        return filename

            .trim()

            .replace(/\s+/g, "_")

            .replace(/[^a-zA-Z0-9._-]/g, "");

    },

    getExtension(filename) {

        return filename

            .split(".")

            .pop()

            .toLowerCase();

    },

    generateFileName(file, prefix = "DOC") {

        const extension = this.getExtension(file.name);

        const random = Math.floor(Math.random() * 900000);

        return `${prefix}_${Date.now()}_${random}.${extension}`;

    },

    /*
    =========================================================
    STORAGE PATH
    =========================================================
    */

    getYear() {

        return new Date().getFullYear();

    },

    getMonth() {

        return String(

            new Date().getMonth() + 1

        ).padStart(2, "0");

    },

    buildFolder(department = "general") {

        return `${department.toLowerCase()}/${this.getYear()}/${this.getMonth()}`;

    },

    buildStoragePath(file, department, prefix = "DOC") {

        return `${

            this.buildFolder(department)

        }/${

            this.generateFileName(file, prefix)

        }`;
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
    FORMAT FILE SIZE
    =========================================================
    */

    formatSize(bytes = 0) {

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
    DOCUMENT METADATA
    =========================================================
    */

    createMetadata(file, storagePath, department) {

        return {

            document_number: generateDocumentNumber("DOC"),

            storage_path: storagePath,

            file_name: file.name,

            mime_type: file.type,

            file_size: file.size,

            department: department,

            workflow_status: WORKFLOW.UPLOADED,

            status: "Uploaded",

            created_at: new Date().toISOString()

        };

    },



    /*
    =========================================================
    CHECK FILE TYPE
    =========================================================
    */

    isImage(file) {

        return file.type.startsWith("image/");

    },



    /*
    =========================================================
    CHECK PDF
    =========================================================
    */

    isPDF(file) {

        return file.type === "application/pdf";

    },



    /*
    =========================================================
    RESET
    =========================================================
    */

    reset() {

        this.bucket = STORAGE.DOCUMENTS;

    },
        /*
    =========================================================
    UPLOAD FILE
    =========================================================
    */

    async uploadFile(file, department = "General", prefix = "DOC") {

        try {

            const validation = this.validate(file);

            if (!validation.valid)
                throw new Error(validation.message);

            const storagePath = this.buildStoragePath(

                file,

                department,

                prefix

            );

            const {

                data,

                error

            } = await window.supabaseClient.storage

                .from(this.bucket)

                .upload(

                    storagePath,

                    file,

                    {

                        cacheControl: "3600",

                        upsert: false

                    }

                );

            if (error)
                throw error;

            return {

                success: true,

                path: storagePath,

                data

            };

        }

        catch (error) {

            console.error(error);

            return {

                success: false,

                error: error.message

            };

        }

    },



    /*
    =========================================================
    PUBLIC URL
    =========================================================
    */

    getPublicUrl(path) {

        const {

            data

        } = window.supabaseClient.storage

            .from(this.bucket)

            .getPublicUrl(path);

        return data.publicUrl;

    },



    /*
    =========================================================
    SIGNED URL
    =========================================================
    */

    async getSignedUrl(path, expires = 3600) {

        const {

            data,

            error

        } = await window.supabaseClient.storage

            .from(this.bucket)

            .createSignedUrl(

                path,

                expires

            );

        if (error)
            throw error;

        return data.signedUrl;

    },



    /*
    =========================================================
    DOWNLOAD FILE
    =========================================================
    */

    async downloadFile(path) {

        const {

            data,

            error

        } = await window.supabaseClient.storage

            .from(this.bucket)

            .download(path);

        if (error)
            throw error;

        return data;

    },



    /*
    =========================================================
    PREVIEW FILE
    =========================================================
    */

    async previewFile(path, iframeId = "pdfViewer") {

        const url = await this.getSignedUrl(path);

        const frame = document.getElementById(iframeId);

        if (frame) {

            frame.src = url;

        }

        return url;

    },



    /*
    =========================================================
    DELETE FILE
    =========================================================
    */

    async deleteFile(path) {

        const {

            error

        } = await window.supabaseClient.storage

            .from(this.bucket)

            .remove([path]);

        if (error)
            throw error;

        return true;

    },
        /*
    =========================================================
    SAVE DOCUMENT METADATA
    =========================================================
    */

    async saveMetadata(document) {

        const {

            data,

            error

        } = await window.supabaseClient

            .from(TABLES.DOCUMENTS)

            .insert(document)

            .select()

            .single();

        if (error)
            throw error;

        return data;

    },



    /*
    =========================================================
    UPDATE DOCUMENT METADATA
    =========================================================
    */

    async updateMetadata(documentId, values) {

        const {

            data,

            error

        } = await window.supabaseClient

            .from(TABLES.DOCUMENTS)

            .update(values)

            .eq("id", documentId)

            .select()

            .single();

        if (error)
            throw error;

        return data;

    },



    /*
    =========================================================
    UPLOAD DOCUMENT
    =========================================================
    */

    async uploadDocument({

        file,

        documentType,

        department,

        customerId = null,

        remarks = "",

        uploadedBy = null

    }) {

        const upload = await this.uploadFile(

            file,

            department,

            "DOC"

        );

        if (!upload.success)
            return upload;

        const metadata = {

            document_number:

                generateDocumentNumber("DOC"),

            customer_id: customerId,

            document_title: file.name,

            document_type: documentType,

            department,

            remarks,

            storage_path: upload.path,

            file_name: file.name,

            mime_type: file.type,

            file_size: file.size,

            workflow_status:

                WORKFLOW.UPLOADED,

            status: "Uploaded",

            uploaded_by: uploadedBy,

            created_at:

                new Date().toISOString()

        };

        const record = await this.saveMetadata(

            metadata

        );

        return {

            success: true,

            record,

            storagePath: upload.path

        };

    },



    /*
    =========================================================
    ARCHIVE DOCUMENT
    =========================================================
    */

    async archiveDocument(documentId) {

        return await this.updateMetadata(

            documentId,

            {

                status: "Archived",

                workflow_status:

                    WORKFLOW.ARCHIVED,

                archived_at:

                    new Date().toISOString()

            }

        );

    },



    /*
    =========================================================
    RESTORE DOCUMENT
    =========================================================
    */

    async restoreDocument(documentId) {

        return await this.updateMetadata(

            documentId,

            {

                status: "Approved",

                workflow_status:

                    WORKFLOW.APPROVED,

                archived_at: null

            }

        );

    },



    /*
    =========================================================
    INITIALIZE
    =========================================================
    */

    init() {

        console.log(

            "Storage Manager Ready"

        );

    }

};



/*
=========================================================
INITIALIZE
=========================================================
*/

StorageManager.init();

window.StorageManager = StorageManager;

    },
