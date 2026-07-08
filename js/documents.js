/*
=========================================================
JJN HUB ERP
DOCUMENTS MODULE
Version 2.0
=========================================================
Dependencies
---------------------------------------------------------
auth.js
config.js
database.js
storage.js
=========================================================
*/

const Documents = {

    /*
    =========================================================
    APPLICATION STATE
    =========================================================
    */

    initialized: false,

    loading: false,

    currentDocument: null,

    documents: [],

    extraction: null,

    dashboard: {

        total: 0,

        pending: 0,

        approved: 0,

        archived: 0

    },



    /*
    =========================================================
    INITIALIZE MODULE
    =========================================================
    */

    async init() {

        try {

            this.loading = true;

            showLoading("Loading Documents...");

            await this.loadDashboard();

            await this.loadRegister();

            this.registerEvents();

            this.initializeDropZone();

            this.initialized = true;

            this.loading = false;

            hideLoading();

            console.log("Documents Module Ready");

        }

        catch (error) {

            this.loading = false;

            hideLoading();

            console.error(error);

            notify(

                error.message ||

                "Unable to initialize Documents Module.",

                "error"

            );

        }

    },



    /*
    =========================================================
    RELOAD PAGE DATA
    =========================================================
    */

    async refresh() {

        await this.loadDashboard();

        await this.loadRegister();

    },



    /*
    =========================================================
    RESET CURRENT DOCUMENT
    =========================================================
    */

    clearCurrentDocument() {

        this.currentDocument = null;

        this.extraction = null;

    },



    /*
    =========================================================
    LOADING STATE
    =========================================================
    */

    setLoading(state) {

        this.loading = state;

        if (state)

            showLoading("Processing...");

        else

            hideLoading();

    },
        /*
    =========================================================
    LOAD DASHBOARD
    =========================================================
    */

    async loadDashboard() {

        try {

            const documents = await DB.Documents.getAll();

            this.documents = documents || [];

            this.dashboard.total = this.documents.length;

            this.dashboard.pending = this.documents.filter(doc =>

                doc.status === STATUS.REVIEW ||

                doc.workflow_status === WORKFLOW.REVIEW

            ).length;

            this.dashboard.approved = this.documents.filter(doc =>

                doc.status === STATUS.APPROVED

            ).length;

            this.dashboard.archived = this.documents.filter(doc =>

                doc.status === STATUS.ARCHIVED

            ).length;

            this.renderDashboard();

        }

        catch (error) {

            console.error(error);

            notify(

                "Unable to load dashboard.",

                "error"

            );

        }

    },



    /*
    =========================================================
    RENDER DASHBOARD
    =========================================================
    */

    renderDashboard() {

        const cards = {

            total: document.getElementById("totalDocuments"),

            pending: document.getElementById("pendingDocuments"),

            approved: document.getElementById("approvedDocuments"),

            archived: document.getElementById("archivedDocuments")

        };

        if (cards.total)

            cards.total.textContent =

                this.dashboard.total;

        if (cards.pending)

            cards.pending.textContent =

                this.dashboard.pending;

        if (cards.approved)

            cards.approved.textContent =

                this.dashboard.approved;

        if (cards.archived)

            cards.archived.textContent =

                this.dashboard.archived;

    },
        /*
    =========================================================
    LOAD DOCUMENT REGISTER
    =========================================================
    */

    async loadRegister() {

        try {

            this.documents = await DB.Documents.getAll();

            this.renderRegister();

        }

        catch (error) {

            console.error(error);

            notify(

                "Unable to load document register.",

                "error"

            );

        }

    },



    /*
    =========================================================
    RENDER DOCUMENT REGISTER
    =========================================================
    */

    renderRegister() {

        const tbody = document.getElementById("documentsTable");

        if (!tbody)

            return;

        tbody.innerHTML = "";

        if (this.documents.length === 0) {

            tbody.innerHTML = `

                <tr>

                    <td colspan="8">

                        No documents found.

                    </td>

                </tr>

            `;

            return;

        }

        this.documents.forEach(documentItem => {

            tbody.innerHTML += `

                <tr>

                    <td>${documentItem.document_number ?? "-"}</td>

                    <td>${documentItem.document_title ?? "-"}</td>

                    <td>${documentItem.document_type ?? "-"}</td>

                    <td>${documentItem.department ?? "-"}</td>

                    <td>${documentItem.workflow_status ?? "-"}</td>

                    <td>${documentItem.status ?? "-"}</td>

                    <td>${formatDate(documentItem.created_at)}</td>

                    <td>

                        <button

                            class="action-btn"

                            onclick="Documents.open(${documentItem.id})">

                            Open

                        </button>

                    </td>

                </tr>

            `;

        });

    },



    /*
    =========================================================
    OPEN DOCUMENT
    =========================================================
    */

    async open(id) {

        try {

            const documentData = await DB.Documents.get(id);

            if (!documentData)

                return;

            this.currentDocument = documentData;

            this.populatePreview(documentData);

            if (documentData.storage_path) {

                await StorageManager.previewFile(

                    documentData.storage_path

                );

            }

        }

        catch (error) {

            console.error(error);

            notify(

                "Unable to open document.",

                "error"

            );

        }

    },



    /*
    =========================================================
    SEARCH DOCUMENTS
    =========================================================
    */

    search(event) {

        const keyword = event.target.value

            .trim()

            .toLowerCase();

        const filtered = this.documents.filter(doc =>

            (doc.document_number || "")

                .toLowerCase()

                .includes(keyword)

            ||

            (doc.document_title || "")

                .toLowerCase()

                .includes(keyword)

            ||

            (doc.document_type || "")

                .toLowerCase()

                .includes(keyword)

            ||

            (doc.department || "")

                .toLowerCase()

                .includes(keyword)

        );

        const original = this.documents;

        this.documents = filtered;

        this.renderRegister();

        this.documents = original;

    },



    /*
    =========================================================
    REGISTER EVENTS
    =========================================================
    */

    registerEvents() {

        const form = document.getElementById(

            "documentUploadForm"

        );

        if (form) {

            form.addEventListener(

                "submit",

                this.handleUpload.bind(this)

            );

        }

        const search = document.getElementById(

            "searchDocument"

        );

        if (search) {

            search.addEventListener(

                "keyup",

                this.search.bind(this)

            );

        }

        const approve = document.getElementById(

            "approveDocument"

        );

        if (approve) {

            approve.addEventListener(

                "click",

                this.approveDocument.bind(this)

            );

        }

    },
        /*
    =========================================================
    HANDLE DOCUMENT UPLOAD
    =========================================================
    */

    async handleUpload(e) {

        e.preventDefault();

        try {

            const fileInput = document.getElementById("documentFile");

            if (!fileInput || fileInput.files.length === 0) {

                notify("Please select a document.", "error");

                return;

            }

            const file = fileInput.files[0];

            const documentType =
                document.getElementById("documentType").value;

            const department =
                document.getElementById("department").value;

            const description =
                document.getElementById("documentDescription").value;

            if (!documentType) {

                notify("Please select a document type.", "error");

                return;

            }

            if (!department) {

                notify("Please select a department.", "error");

                return;

            }

            const validation = StorageManager.validate(file);

            if (!validation.valid) {

                notify(validation.message, "error");

                return;

            }

            this.setLoading(true);

            const user = await getCurrentUser();

            const result = await StorageManager.uploadDocument({

                file,

                documentType,

                department,

                remarks: description,

                uploadedBy: user ? user.id : null

            });

            this.setLoading(false);

            if (!result.success) {

                notify("Document upload failed.", "error");

                return;

            }

            this.currentDocument = result.record;

            this.populatePreview(result.record);

            await this.refresh();

            notify("Document uploaded successfully.");

            if (document.getElementById("autoExtract")?.checked) {

                await this.startExtraction(result.record);

            }

        }

        catch (error) {

            this.setLoading(false);

            console.error(error);

            notify(error.message, "error");

        }

    },



    /*
    =========================================================
    POPULATE EXTRACTION PREVIEW
    =========================================================
    */

    populatePreview(documentData) {

        const fields = {

            documentNumber: documentData.document_number,

            clientName: documentData.customer_name,

            departmentName: documentData.department,

            projectName: documentData.project,

            prNumber: documentData.pr_number,

            projectLocation: documentData.location,

            contactPerson: documentData.contact_person,

            contactEmail: documentData.email

        };

        Object.entries(fields).forEach(([id, value]) => {

            const input = document.getElementById(id);

            if (input) {

                input.value = value || "";

            }

        });

    },
        /*
    =========================================================
    INITIALIZE DRAG & DROP
    =========================================================
    */

    initializeDropZone() {

        const dropZone = document.getElementById("dropZone");

        const fileInput = document.getElementById("documentFile");

        if (!dropZone || !fileInput)

            return;

        dropZone.addEventListener("click", () => {

            fileInput.click();

        });

        dropZone.addEventListener("dragover", (e) => {

            e.preventDefault();

            dropZone.classList.add("dragging");

        });

        dropZone.addEventListener("dragleave", () => {

            dropZone.classList.remove("dragging");

        });

        dropZone.addEventListener("drop", (e) => {

            e.preventDefault();

            dropZone.classList.remove("dragging");

            if (!e.dataTransfer.files.length)

                return;

            fileInput.files = e.dataTransfer.files;

            this.displaySelectedFile();

        });

        fileInput.addEventListener("change", () => {

            this.displaySelectedFile();

        });

    },



    /*
    =========================================================
    DISPLAY SELECTED FILE
    =========================================================
    */

    displaySelectedFile() {

        const fileInput = document.getElementById("documentFile");

        if (!fileInput.files.length)

            return;

        const file = fileInput.files[0];

        const dropZone = document.getElementById("dropZone");

        if (!dropZone)

            return;

        dropZone.innerHTML = `

            <div class="upload-preview">

                <div class="upload-icon">

                    ${StorageManager.getIcon(file.type)}

                </div>

                <div class="upload-details">

                    <h3>${file.name}</h3>

                    <p>

                        ${StorageManager.formatSize(file.size)}

                    </p>

                </div>

                <button

                    type="button"

                    class="action-btn"

                    onclick="Documents.removeSelectedFile()">

                    Remove

                </button>

            </div>

        `;

    },



    /*
    =========================================================
    REMOVE FILE
    =========================================================
    */

    removeSelectedFile() {

        const fileInput = document.getElementById("documentFile");

        const dropZone = document.getElementById("dropZone");

        if (fileInput)

            fileInput.value = "";

        if (dropZone) {

            dropZone.innerHTML = `

                <div class="upload-placeholder">

                    <div class="upload-icon">

                        📁

                    </div>

                    <h3>

                        Drag & Drop Document

                    </h3>

                    <p>

                        or click here to browse

                    </p>

                    <small>

                        PDF, DOCX, XLSX, JPG, PNG

                    </small>

                </div>

            `;

        }

    },



    /*
    =========================================================
    FILE INFORMATION
    =========================================================
    */

    getSelectedFile() {

        const input = document.getElementById("documentFile");

        if (!input || !input.files.length)

            return null;

        return input.files[0];

    },



    /*
    =========================================================
    RESET FORM
    =========================================================
    */

    resetUploadForm() {

        const form = document.getElementById(

            "documentUploadForm"

        );

        if (form)

            form.reset();

        this.removeSelectedFile();

        this.clearCurrentDocument();

    },
        /*
    =========================================================
    START DOCUMENT EXTRACTION
    =========================================================
    */

    async startExtraction(documentData) {

        try {

            notify(

                "Starting document extraction...",

                "info"

            );

            const { data, error } = await supabase.functions.invoke(

                "extract-document",

                {

                    body: {

                        documentId: documentData.id,

                        storagePath: documentData.storage_path,

                        documentType: documentData.document_type

                    }

                }

            );

            if (error)

                throw error;

            notify(

                "Extraction completed.",

                "success"

            );

            await this.loadExtraction(documentData.id);

        }

        catch (error) {

            console.error(error);

            notify(

                "Extraction failed.",

                "error"

            );

        }

    },



    /*
    =========================================================
    LOAD EXTRACTION
    =========================================================
    */

    async loadExtraction(documentId) {

        try {

            const { data, error } = await supabase

                .from("document_extractions")

                .select("*")

                .eq("document_id", documentId)

                .single();

            if (error)

                throw error;

            this.extraction = data;

            this.showExtraction(data);

        }

        catch (error) {

            console.error(error);

        }

    },



    /*
    =========================================================
    DISPLAY EXTRACTION
    =========================================================
    */

    showExtraction(data) {

        if (!data)

            return;

        this.populatePreview({

            document_number: this.currentDocument.document_number,

            customer_name: data.client,

            department: data.department,

            project: data.project,

            pr_number: data.pr_number,

            location: data.location,

            contact_person: data.contact_person,

            email: data.email

        });

    },



    /*
    =========================================================
    UPLOAD PROGRESS
    =========================================================
    */

    setUploadProgress(percent) {

        const progress = document.getElementById(

            "uploadProgress"

        );

        const label = document.getElementById(

            "uploadPercentage"

        );

        if (progress)

            progress.value = percent;

        if (label)

            label.textContent = percent + "%";

    },



    /*
    =========================================================
    UPLOAD COMPLETE
    =========================================================
    */

    uploadComplete() {

        this.setUploadProgress(100);

        notify(

            "Upload completed successfully.",

            "success"

        );

    },



    /*
    =========================================================
    UPLOAD FAILED
    =========================================================
    */

    uploadFailed(message = "Upload failed.") {

        this.setUploadProgress(0);

        notify(

            message,

            "error"

        );

    },
        /*
    =========================================================
    APPROVE DOCUMENT
    =========================================================
    */

    async approveDocument() {

        try {

            if (!this.currentDocument) {

                notify(

                    "Please open a document first.",

                    "warning"

                );

                return;

            }

            await DB.Documents.update(

                this.currentDocument.id,

                {

                    status: STATUS.APPROVED,

                    workflow_status: WORKFLOW.APPROVED

                }

            );

            await this.saveWorkflow(

                "Approval",

                "Approved",

                "Document approved."

            );

            await this.addAuditLog(

                "Approved",

                "Document approved."

            );

            notify(

                "Document approved successfully.",

                "success"

            );

            await this.refresh();

        }

        catch (error) {

            console.error(error);

            notify(error.message, "error");

        }

    },



    /*
    =========================================================
    REJECT DOCUMENT
    =========================================================
    */

    async rejectDocument(reason = "") {

        try {

            if (!this.currentDocument)

                return;

            await DB.Documents.update(

                this.currentDocument.id,

                {

                    status: STATUS.REJECTED,

                    workflow_status: WORKFLOW.REJECTED,

                    remarks: reason

                }

            );

            await this.saveWorkflow(

                "Review",

                "Rejected",

                reason

            );

            await this.addAuditLog(

                "Rejected",

                reason

            );

            notify(

                "Document rejected.",

                "warning"

            );

            await this.refresh();

        }

        catch (error) {

            console.error(error);

        }

    },



    /*
    =========================================================
    SAVE WORKFLOW
    =========================================================
    */

    async saveWorkflow(stage, status, remarks = "") {

        try {

            const user = await getCurrentUser();

            await supabase

                .from("document_workflow")

                .insert({

                    document_id:

                        this.currentDocument.id,

                    stage,

                    status,

                    assigned_to:

                        user?.id,

                    remarks

                });

        }

        catch (error) {

            console.error(error);

        }

    },



    /*
    =========================================================
    LOAD WORKFLOW
    =========================================================
    */

    async loadWorkflow(documentId) {

        try {

            const { data, error } = await supabase

                .from("document_workflow")

                .select("*")

                .eq(

                    "document_id",

                    documentId

                )

                .order(

                    "created_at",

                    {

                        ascending: false

                    }

                );

            if (error)

                throw error;

            this.renderWorkflow(data);

        }

        catch (error) {

            console.error(error);

        }

    },



    /*
    =========================================================
    RENDER WORKFLOW
    =========================================================
    */

    renderWorkflow(records) {

        const tbody = document.getElementById(

            "workflowTable"

        );

        if (!tbody)

            return;

        tbody.innerHTML = "";

        if (!records.length) {

            tbody.innerHTML = `

                <tr>

                    <td colspan="4">

                        No workflow available.

                    </td>

                </tr>

            `;

            return;

        }

        records.forEach(record => {

            tbody.innerHTML += `

                <tr>

                    <td>${record.stage}</td>

                    <td>${record.status}</td>

                    <td>${record.remarks || "-"}</td>

                    <td>${formatDate(record.created_at)}</td>

                </tr>

            `;

        });

    },
        /*
    =========================================================
    LOAD AUDIT TRAIL
    =========================================================
    */

    async loadAuditTrail(documentId) {

        try {

            const { data, error } = await supabase

                .from("document_audit")

                .select("*")

                .eq("document_id", documentId)

                .order("created_at", {

                    ascending: false

                });

            if (error) throw error;

            this.renderAuditTrail(data);

        }

        catch (error) {

            console.error(error);

        }

    },



    /*
    =========================================================
    RENDER AUDIT TRAIL
    =========================================================
    */

    renderAuditTrail(records) {

        const tbody = document.getElementById("auditTable");

        if (!tbody)

            return;

        tbody.innerHTML = "";

        if (!records.length) {

            tbody.innerHTML = `

                <tr>

                    <td colspan="4">

                        No audit history available.

                    </td>

                </tr>

            `;

            return;

        }

        records.forEach(record => {

            tbody.innerHTML += `

                <tr>

                    <td>${record.action}</td>

                    <td>${record.remarks || "-"}</td>

                    <td>${record.user_id || "-"}</td>

                    <td>${formatDate(record.created_at)}</td>

                </tr>

            `;

        });

    },



    /*
    =========================================================
    ADD AUDIT LOG
    =========================================================
    */

    async addAuditLog(action, remarks = "") {

        try {

            const user = await getCurrentUser();

            await supabase

                .from("document_audit")

                .insert({

                    document_id: this.currentDocument.id,

                    user_id: user?.id,

                    action,

                    remarks

                });

        }

        catch (error) {

            console.error(error);

        }

    },



    /*
    =========================================================
    PREVIEW DOCUMENT
    =========================================================
    */

    async previewDocument() {

        try {

            if (!this.currentDocument)

                return;

            await StorageManager.previewFile(

                this.currentDocument.storage_path

            );

        }

        catch (error) {

            console.error(error);

            notify(

                "Unable to preview document.",

                "error"

            );

        }

    },



    /*
    =========================================================
    DOWNLOAD DOCUMENT
    =========================================================
    */

    async downloadDocument() {

        try {

            if (!this.currentDocument)

                return;

            const blob = await StorageManager.downloadFile(

                this.currentDocument.storage_path

            );

            if (!blob)

                return;

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;

            link.download =

                this.currentDocument.file_name ||

                "document.pdf";

            document.body.appendChild(link);

            link.click();

            link.remove();

            URL.revokeObjectURL(url);

        }

        catch (error) {

            console.error(error);

            notify(

                "Unable to download document.",

                "error"

            );

        }

    },
        /*
    =========================================================
    ARCHIVE DOCUMENT
    =========================================================
    */

    async archiveDocument() {

        try {

            if (!this.currentDocument)

                return;

            await DB.Documents.update(

                this.currentDocument.id,

                {

                    status: STATUS.ARCHIVED,

                    workflow_status: WORKFLOW.ARCHIVED,

                    archived_at: new Date().toISOString()

                }

            );

            await this.addAuditLog(

                "Archived",

                "Document archived."

            );

            notify(

                "Document archived.",

                "success"

            );

            await this.refresh();

        }

        catch (error) {

            console.error(error);

            notify(error.message, "error");

        }

    },



    /*
    =========================================================
    RESTORE DOCUMENT
    =========================================================
    */

    async restoreDocument() {

        try {

            if (!this.currentDocument)

                return;

            await DB.Documents.update(

                this.currentDocument.id,

                {

                    status: STATUS.APPROVED,

                    workflow_status: WORKFLOW.APPROVED,

                    archived_at: null

                }

            );

            await this.addAuditLog(

                "Restored",

                "Document restored."

            );

            notify(

                "Document restored.",

                "success"

            );

            await this.refresh();

        }

        catch (error) {

            console.error(error);

        }

    },



    /*
    =========================================================
    DELETE DOCUMENT
    =========================================================
    */

    async deleteDocument() {

        try {

            if (!this.currentDocument)

                return;

            if (!confirm(

                "Delete this document permanently?"

            ))

                return;

            await StorageManager.deleteFile(

                this.currentDocument.storage_path

            );

            await DB.Documents.delete(

                this.currentDocument.id

            );

            await this.addAuditLog(

                "Deleted",

                "Document deleted."

            );

            this.resetUploadForm();

            await this.refresh();

            notify(

                "Document deleted.",

                "success"

            );

        }

        catch (error) {

            console.error(error);

            notify(error.message, "error");

        }

    },



    /*
    =========================================================
    PRINT DOCUMENT
    =========================================================
    */

    async printDocument() {

        try {

            if (!this.currentDocument)

                return;

            const url = await StorageManager.getSignedUrl(

                this.currentDocument.storage_path

            );

            const win = window.open(

                url,

                "_blank"

            );

            if (win)

                win.print();

        }

        catch (error) {

            console.error(error);

        }

    },



    /*
    =========================================================
    EXPORT DOCUMENT DETAILS
    =========================================================
    */

    exportDocument() {

        if (!this.currentDocument)

            return;

        const data = JSON.stringify(

            this.currentDocument,

            null,

            2

        );

        const blob = new Blob(

            [data],

            {

                type: "application/json"

            }

        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download =

            this.currentDocument.document_number +

            ".json";

        link.click();

        URL.revokeObjectURL(url);

    }

};



/*
=========================================================
GLOBAL ACCESS
=========================================================
*/

window.Documents = Documents;



/*
=========================================================
START MODULE
=========================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        Documents.init();

    }

);
