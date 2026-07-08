/*
=========================================================
JJN HUB ERP
Database Helper Functions
=========================================================
Requires:
- auth.js
- config.js
=========================================================
*/

const DB = {};

/*=========================================================
GENERIC CRUD
=========================================================*/

DB.getAll = async function (table, orderBy = "created_at") {

    const { data, error } = await window.supabaseClient
        .from(table)
        .select("*")
        .order(orderBy, { ascending: false });

    if (error) throw error;

    return data;

};


DB.getById = async function (table, id) {

    const { data, error } = await window.supabaseClient
        .from(table)
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;

    return data;

};


DB.insert = async function (table, values) {

    const { data, error } = await window.supabaseClient
        .from(table)
        .insert(values)
        .select();

    if (error) throw error;

    return data;

};


DB.update = async function (table, id, values) {

    const { data, error } = await window.supabaseClient
        .from(table)
        .update(values)
        .eq("id", id)
        .select();

    if (error) throw error;

    return data;

};


DB.remove = async function (table, id) {

    const { error } = await window.supabaseClient
        .from(table)
        .delete()
        .eq("id", id);

    if (error) throw error;

};


/*=========================================================
DOCUMENTS
=========================================================*/

DB.Documents = {

    async getAll() {

        return await DB.getAll(TABLES.DOCUMENTS);

    },

    async get(id) {

        return await DB.getById(TABLES.DOCUMENTS, id);

    },

    async create(document) {

        return await DB.insert(TABLES.DOCUMENTS, document);

    },

    async update(id, values) {

        return await DB.update(TABLES.DOCUMENTS, id, values);

    },

    async delete(id) {

        return await DB.remove(TABLES.DOCUMENTS, id);

    }

};


/*=========================================================
CUSTOMERS
=========================================================*/

DB.Customers = {

    async getAll() {

        return await DB.getAll(TABLES.CUSTOMERS);

    },

    async create(customer) {

        return await DB.insert(TABLES.CUSTOMERS, customer);

    }

};


/*=========================================================
ENGINEERING PROJECTS
=========================================================*/

DB.Engineering = {

    async getAll() {

        return await DB.getAll(TABLES.ENGINEERING_PROJECTS);

    },

    async create(project) {

        return await DB.insert(TABLES.ENGINEERING_PROJECTS, project);

    },

    async update(id, values) {

        return await DB.update(TABLES.ENGINEERING_PROJECTS, id, values);

    }

};


/*=========================================================
QUOTATIONS
=========================================================*/

DB.Quotations = {

    async getAll() {

        return await DB.getAll(TABLES.QUOTATIONS);

    },

    async create(quotation) {

        return await DB.insert(TABLES.QUOTATIONS, quotation);

    },

    async update(id, values) {

        return await DB.update(TABLES.QUOTATIONS, id, values);

    }

};


/*=========================================================
AUDIT LOG
=========================================================*/

DB.log = async function (action, module, recordId, remarks = "") {

    const user = await getCurrentUser();

    await supabase
        .from(TABLES.DOCUMENT_AUDIT)
        .insert({

            user_id: user?.id,

            action,

            module,

            record_id: recordId,

            remarks

        });

};


/*=========================================================
EXPORT
=========================================================*/

window.DB = DB;
