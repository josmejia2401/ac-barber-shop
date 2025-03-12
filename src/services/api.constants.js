export default Object.freeze({
    auth: {
        signIn: `/dev/api/v1/security/login`,
    },
    users: {
        register: `/dev/api/v1/users`,
    },
    employees: {
        create: `/dev/api/v1/employees`,
        delete: `/dev/api/v1/employees/:id`,
        update: `/dev/api/v1/employees/:id`,
        filter: `/dev/api/v1/employees`
    },
    customers: {
        create: `/dev/api/v1/customers`,
        delete: `/dev/api/v1/customers/:id`,
        update: `/dev/api/v1/customers/:id`,
        filter: `/dev/api/v1/customers`
    }
});