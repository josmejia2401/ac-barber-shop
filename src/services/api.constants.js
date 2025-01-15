export default Object.freeze({
    auth: {
        signIn: `/dev/api/v1/security/login`,
    },
    users: {
        register: `/dev/api/v1/users`,
    },
    projects: {
        create: `/dev/api/v1/projects`,
        delete: `/dev/api/v1/projects/:id`,
        update: `/dev/api/v1/projects/:id`,
        find: `/dev/api/v1/projects/:id`,
        filter: `/dev/api/v1/projects`
    },
    functionalities: {
        create: `/dev/api/v1/functionalities`,
        delete: `/dev/api/v1/functionalities/:id/:projectId`,
        update: `/dev/api/v1/functionalities/:id`,
        find: `/dev/api/v1/functionalities/:id/:projectId`,
        filter: `/dev/api/v1/functionalities`
    },
    tasks: {
        create: `/dev/api/v1/tasks`,
        delete: `/dev/api/v1/tasks/:id/:functionalityId`,
        update: `/dev/api/v1/tasks/:id`,
        find: `/dev/api/v1/tasks/:id/:functionalityId`,
        filter: `/dev/api/v1/tasks`
    }
});