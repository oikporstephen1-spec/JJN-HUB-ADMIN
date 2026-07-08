/*
=========================================================
JJN HUB ERP
Documents Module
Version 1.0
=========================================================
Requires

auth.js
config.js
database.js
storage.js
=========================================================
*/

const Documents = {

    initialized: false,

    currentDocument: null,

    documents: [],

    dashboard: {

        total: 0,

        pending: 0,

        approved: 0,

        archived: 0

    },



    /*
    =========================================================
    INITIALIZE
    =========================================================
    */

    async init() {

        try {

            showLoading("Loading Documents...");

            await this.loadDashboard();

            await this.loadRegister();

            this.initializeDropZone();
            this.initialized = true;

            hideLoading();

            console.log("Documents Module Ready");

        }

        catch (err) {

            hideLoading();

            console.error(err);

            notify(err.message, "error");

        }

    },



    /*
    =========================================================
    LOAD DASHBOARD
    =========================================================
    */

    async loadDashboard() {

        const documents = await DB.Documents.getAll();

        this.documents = documents || [];

        this.dashboard.total = this.documents.length;

        this.dashboard.pending = this.documents.filter(

            d => d.status === STATUS.REVIEW

        ).length;

        this.dashboard.approved = this.documents.filter(

            d => d.status === STATUS.APPROVED

        ).length;

        this.dashboard.archived = this.documents.filter(

            d => d.status === STATUS.ARCHIVED

        ).length;

        this.renderDashboard();

    },



    /*
    =========================================================
    RENDER DASHBOARD
    =========================================================
    */

    renderDashboard() {

        const total = document.getElementById("totalDocuments");

        const pending = document.getElementById("pendingDocuments");

        const approved = document.getElementById("approvedDocuments");

        const archived = document.getElementById("archivedDocuments");

        if (total)

            total.textContent = this.dashboard.total;

        if (pending)

            pending.textContent = this.dashboard.pending;

        if (approved)

            approved.textContent = this.dashboard.approved;

        if (archived)

            archived.textContent = this.dashboard.archived;

    },



    /*
    =========================================================
    LOAD REGISTER
    =========================================================
    */

    async loadRegister() {

        this.documents = await DB.Documents.getAll();

        this.renderRegister();

    },



    /*
    =========================================================
    RENDER DOCUMENT REGISTER
    =========================================================
    */

    renderRegister() {

        const tbody = document.getElementById(

            "documentsTable"

        );

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

                <td>${documentItem.document_number}</td>

                <td>${documentItem.customer || "-"}</td>

                <td>${documentItem.document_type}</td>

                <td>${documentItem.department}</td>

                <td>${documentItem.workflow_status}</td>

                <td>${documentItem.status}</td>

                <td>${formatDate(documentItem.created_at)}</td>

                <td>

                    <button

                        class="action-btn"

                        onclick="Documents.open('${documentItem.id}')">

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

        const documentData = await DB.Documents.get(id);

        this.currentDocument = documentData;

        console.log(documentData);

    },



    /*
    =========================================================
    REFRESH
    =========================================================
    */

    async refresh() {

        await this.loadDashboard();

        await this.loadRegister();

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

    },



    /*
    =========================================================
    PLACEHOLDERS
    =========================================================
    */

    async handleUpload(e) {

        e.preventDefault();

        console.log("Upload handler...");

    },



    search() {

        console.log("Search...");

    }

};



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

            const remarks =
                document.getElementById("documentDescription").value;

            if (!documentType || !department) {

                notify("Document Type and Department are required.", "error");

                return;

            }

            const user = await getCurrentUser();

            const result = await StorageManager.uploadDocument({

                file,

                documentType,

                department,

                remarks,

                uploadedBy: user ? user.id : null

            });

            if (!result.success) {

                notify("Upload failed.", "error");

                return;

            }

            notify("Document uploaded successfully.");

            this.currentDocument = result.record;

            this.populatePreview(result.record);

            await this.refresh();

            if (document.getElementById("autoExtract")?.checked) {

                this.startExtraction(result.record);

            }

        }

        catch (err) {

            console.error(err);

            notify(err.message, "error");

        }

    },



    /*
    =========================================================
    POPULATE PREVIEW
    =========================================================
    */

    populatePreview(documentData) {

        document.getElementById("documentNumber").value =
            documentData.document_number || "";

        document.getElementById("departmentName").value =
            documentData.department || "";

        document.getElementById("clientName").value =
            documentData.customer || "";

    },



    /*
    =========================================================
    START EXTRACTION
    =========================================================
    */

    async startExtraction(documentData) {

        console.log(

            "Starting OCR extraction...",

            documentData.id

        );

        notify(

            "Document uploaded. OCR processing will begin.",

            "success"

        );

        /*
        Phase 3

        OCR / AI extraction will be added here.

        */

    },



    /*
    =========================================================
    DRAG & DROP
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

            if (e.dataTransfer.files.length === 0)

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

        dropZone.innerHTML = `

            <div class="upload-icon">

                ${StorageManager.getIcon(file.type)}

            </div>

            <h3>${file.name}</h3>

            <p>${StorageManager.formatSize(file.size)}</p>

        `;

    },
    /*
    =========================================================
    START EXTRACTION
    =========================================================
    */

    async startExtraction(documentData) {

        try {

            showLoading("Extracting document...");

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

            hideLoading();

            if (error) throw error;

            notify("Extraction completed.");

            await this.loadExtraction(documentData.id);

        }

        catch (err) {

            hideLoading();

            console.error(err);

            notify(err.message, "error");

        }

    },



    /*
    =========================================================
    LOAD EXTRACTION
    =========================================================
    */

    async loadExtraction(documentId) {

        const { data, error } = await supabase

            .from(TABLES.DOCUMENT_EXTRACTIONS)

            .select("*")

            .eq("document_id", documentId)

            .single();

        if (error) {

            console.error(error);

            return;

        }

        this.showExtraction(data);

    },



    /*
    =========================================================
    DISPLAY EXTRACTION
    =========================================================
    */

    showExtraction(data) {

        document.getElementById("clientName").value =
            data.client || "";

        document.getElementById("prNumber").value =
            data.pr_number || "";

        document.getElementById("projectName").value =
            data.project || "";

        document.getElementById("departmentName").value =
            data.department || "";

        document.getElementById("projectLocation").value =
            data.location || "";

        document.getElementById("contactPerson").value =
            data.contact_person || "";

        document.getElementById("contactEmail").value =
            data.email || "";

        this.renderItems(data.items || []);

    },



    /*
    =========================================================
    DETECTED ITEMS
    =========================================================
    */

    renderItems(items) {

        const tbody = document.getElementById("documentItems");

        if (!tbody) return;

        tbody.innerHTML = "";

        if (items.length === 0) {

            tbody.innerHTML = `

                <tr>

                    <td colspan="5">

                        No items detected.

                    </td>

                </tr>

            `;

            return;

        }

        items.forEach(item => {

            tbody.innerHTML += `

            <tr>

                <td>${item.description}</td>

                <td>${item.quantity}</td>

                <td>${item.unit || "Nos"}</td>

                <td>${item.destination || "Engineering"}</td>

                <td>

                    <span class="status-active">

                        Ready

                    </span>

                </td>

            </tr>

            `;

        });

    },



    /*
    =========================================================
    APPROVE EXTRACTION
    =========================================================
    */

    async approveDocument() {

        if (!this.currentDocument)

            return;

        await DB.Documents.update(

            this.currentDocument.id,

            {

                status: STATUS.APPROVED,

                workflow_status: WORKFLOW.APPROVED

            }

        );

        notify("Document approved.");

        await this.refresh();

    },
