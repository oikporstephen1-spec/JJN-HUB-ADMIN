/*
=========================================================
JJN HUB ERP
Storage Manager
Part 1 - Core Configuration & Helpers
=========================================================
Requires:
- auth.js
- config.js
=========================================================
*/

const StorageManager = {

    /*
    =========================================================
    DEFAULT SETTINGS
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

                message: "File exceeds maximum upload size."

            };

        }

        return {

            valid: true,

            message: "OK"

        };

    },

    /*
    =========================================================
    SANITIZE FILE NAME
    =========================================================
    */

    sanitizeFileName(filename) {

        return filename

            .trim()

            .replace(/\s+/g, "_")

            .replace(/[^a-zA-Z0-9._-]/g, "");

    },

    /*
    =========================================================
    FILE EXTENSION
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

    generateFileName(file, prefix = PREFIX.DOCUMENT) {

        const ext = this.getExtension(file.name);

        const timestamp = Date.now();

        const random = Math.floor(Math.random() * 9000) + 1000;

        return `${prefix}_${timestamp}_${random}.${ext}`;

    },

    /*
    =========================================================
    YEAR
    =========================================================
    */

    getYear() {

        return new Date().getFullYear();

    },

    /*
    =========================================================
    MONTH
    =========================================================
    */

    getMonth() {

        return String(new Date().getMonth() + 1)

            .padStart(2, "0");

    },

    /*
    =========================================================
    FOLDER PATH
    =========================================================
    */

    buildFolder(department) {

        const dep = (department || "general")

            .toLowerCase()

            .replace(/\s+/g, "-");

        return `${dep}/${this.getYear()}/${this.getMonth()}`;

    },

    /*
    =========================================================
    STORAGE PATH
    =========================================================
    */

    buildStoragePath(file, department, prefix = PREFIX.DOCUMENT) {

        const folder = this.buildFolder(department);

        const filename = this.generateFileName(file, prefix);

        return `${folder}/${filename}`;

    },

    /*
    =========================================================
    FILE ICON
    =========================================================
    */

    getIcon(type) {

        if (type.includes("pdf"))

            return "📄";

        if (type.includes("image"))

            return "🖼";

        if (type.includes("word"))

            return "📝";

        if (type.includes("excel"))

            return "📊";

        return "📁";

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
    FILE METADATA
    =========================================================
    */

    createMetadata(file, path, department) {

        return {

            original_name: file.name,

            storage_path: path,

            mime_type: file.type,

            size: file.size,

            department: department,

            uploaded_at: new Date().toISOString()

        };

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
    UPLOAD FILE TO SUPABASE STORAGE
    =========================================================
    */

    async uploadFile(file, department = "General", prefix = PREFIX.DOCUMENT) {

        try {

            const validation = this.validate(file);

            if (!validation.valid) {

                throw new Error(validation.message);

            }

            showLoading("Uploading document...");

            const storagePath = this.buildStoragePath(

                file,

                department,

                prefix

            );

            const {

                data,

                error

            } = await supabase.storage

                .from(this.bucket)

                .upload(

                    storagePath,

                    file,

                    {

                        cacheControl: "3600",

                        upsert: false

                    }

                );

            if (error) throw error;

            hideLoading();

            return {

                success: true,

                path: storagePath,

                data

            };

        }

        catch (err) {

            hideLoading();

            console.error(err);

            notify(err.message, "error");

            return {

                success: false,

                error: err.message

            };

        }

    },



    /*
    =========================================================
    GET PUBLIC URL
    =========================================================
    */

    getPublicUrl(path) {

        const {

            data

        } = supabase.storage

            .from(this.bucket)

            .getPublicUrl(path);

        return data.publicUrl;

    },



    /*
    =========================================================
    CREATE SIGNED URL
    =========================================================
    */

    async getSignedUrl(path, expires = 3600) {

        const {

            data,

            error

        } = await supabase.storage

            .from(this.bucket)

            .createSignedUrl(

                path,

                expires

            );

        if (error) throw error;

        return data.signedUrl;

    },



    /*
    =========================================================
    DOWNLOAD FILE
    =========================================================
    */

    async downloadFile(path) {

        try {

            const {

                data,

                error

            } = await supabase.storage

                .from(this.bucket)

                .download(path);

            if (error) throw error;

            return data;

        }

        catch (err) {

            console.error(err);

            notify(err.message, "error");

        }

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
    SAVE DOCUMENT METADATA
    =========================================================
    */

    async saveMetadata(document) {

        try {

            const {

                data,

                error

            } = await supabase

                .from(TABLES.DOCUMENTS)

                .insert(document)

                .select()

                .single();

            if (error) throw error;

            return data;

        }

        catch (err) {

            console.error(err);

            notify(err.message, "error");

            throw err;

        }

    },



    /*
    =========================================================
    UPLOAD + SAVE DOCUMENT
    =========================================================
    */

    async uploadDocument({

        file,

        documentType,

        department,

        customer = "",

        remarks = "",

        uploadedBy = null

    }) {

        const upload = await this.uploadFile(

            file,

            department,

            documentType

        );

        if (!upload.success)

            return upload;

        const metadata = {

            document_number: generateDocumentNumber(documentType),

            document_type: documentType,

            customer,

            department,

            remarks,

            storage_path: upload.path,

            file_name: file.name,

            mime_type: file.type,

            file_size: file.size,

            workflow_status: WORKFLOW.UPLOADED,

            status: STATUS.UPLOADED,

            uploaded_by: uploadedBy,

            created_at: new Date().toISOString()

        };

        const record = await this.saveMetadata(metadata);

        return {

            success: true,

            record

        };

    },
    /*
    =========================================================
    DELETE FILE
    =========================================================
    */

    async deleteFile(path) {

        try {

            const { error } = await supabase.storage
                .from(this.bucket)
                .remove([path]);

            if (error) throw error;

            return true;

        } catch (err) {

            console.error(err);

            notify(err.message, "error");

            return false;

        }

    },


    /*
    =========================================================
    MOVE FILE
    =========================================================
    */

    async moveFile(oldPath, newPath) {

        try {

            const { error } = await supabase.storage
                .from(this.bucket)
                .move(oldPath, newPath);

            if (error) throw error;

            return true;

        } catch (err) {

            console.error(err);

            notify(err.message, "error");

            return false;

        }

    },


    /*
    =========================================================
    COPY FILE
    =========================================================
    */

    async copyFile(oldPath, newPath) {

        try {

            const { error } = await supabase.storage
                .from(this.bucket)
                .copy(oldPath, newPath);

            if (error) throw error;

            return true;

        } catch (err) {

            console.error(err);

            notify(err.message, "error");

            return false;

        }

    },


    /*
    =========================================================
    LIST FILES
    =========================================================
    */

    async list(folder = "") {

        try {

            const { data, error } = await supabase.storage
                .from(this.bucket)
                .list(folder);

            if (error) throw error;

            return data;

        } catch (err) {

            console.error(err);

            return [];

        }

    },


    /*
    =========================================================
    CHECK FILE EXISTS
    =========================================================
    */

    async exists(path) {

        const folder = path.substring(0, path.lastIndexOf("/"));

        const filename = path.split("/").pop();

        const files = await this.list(folder);

        return files.some(file => file.name === filename);

    },


    /*
    =========================================================
    UPDATE DOCUMENT METADATA
    =========================================================
    */

    async updateMetadata(documentId, values) {

        const { data, error } = await supabase

            .from(TABLES.DOCUMENTS)

            .update(values)

            .eq("id", documentId)

            .select()

            .single();

        if (error) throw error;

        return data;

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

                status: STATUS.ARCHIVED,

                workflow_status: WORKFLOW.ARCHIVED,

                archived_at: new Date().toISOString()

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

                status: STATUS.APPROVED,

                workflow_status: WORKFLOW.APPROVED,

                archived_at: null

            }

        );

    },


    /*
    =========================================================
    DOCUMENT HISTORY
    =========================================================
    */

    async history(documentId) {

        const { data, error } = await supabase

            .from(TABLES.DOCUMENT_AUDIT)

            .select("*")

            .eq("document_id", documentId)

            .order("created_at", {

                ascending: false

            });

        if (error) throw error;

        return data;

    },


    /*
    =========================================================
    WRITE AUDIT LOG
    =========================================================
    */

    async log(documentId, action, remarks = "") {

        const user = await getCurrentUser();

        return await supabase

            .from(TABLES.DOCUMENT_AUDIT)

            .insert({

                document_id: documentId,

                user_id: user?.id,

                action,

                remarks,

                created_at: new Date().toISOString()

            });

    },


    /*
    =========================================================
    INITIALIZE STORAGE
    =========================================================
    */

    init() {

        console.log(

            "JJN HUB Storage Manager Ready"

        );

    }
StorageManager.init();

window.StorageManager = StorageManager;
