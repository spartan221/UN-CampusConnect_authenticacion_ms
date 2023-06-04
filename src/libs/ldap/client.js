
import { LDAP_URL, FULL_DOMAIN_COMPONENT, ADMIN_USER, ADMIN_PASSWORD } from './constants';
import ldap from 'ldapjs-promise';

const createAdminConnection = () => {
    return new Promise((resolve, reject) => {
        const client = ldap.createClient({
            url: `ldap://${LDAP_URL}`
        });
        client.bind(`cn=${ADMIN_USER},${FULL_DOMAIN_COMPONENT}`, ADMIN_PASSWORD)
            .then(() => resolve(client))
            .catch((err) => reject(err))
    });
}

const createUserConnection = (username, password) => {
    return new Promise((resolve, reject) => {
        const client = ldap.createClient({
            url: `ldap://${LDAP_URL}`
        });
        client.bind(`cn=${username},ou=uncampusconnect,${FULL_DOMAIN_COMPONENT}`, password)
            .then(() => resolve(client))
            .catch((err) => reject(err))
    });
}

export const addUser = (user) => {
    return new Promise((resolve, reject) => {
        const { username, email, password, id } = user;
        createAdminConnection()
            .then((connectedClient) => {
                const entry = {
                    objectClass: ['top', 'posixAccount', 'inetOrgPerson'],
                    sn: 'uncampusconnect',
                    mail: email,
                    cn: username,
                    uid: id,
                    userPassword: password,
                    uidNumber: '1001',
                    gidNumber: '500',
                    homeDirectory: '/home/' + username,
                };
                connectedClient.add(`cn=${username}, ou=uncampusconnect,${FULL_DOMAIN_COMPONENT}`, entry)
                    .then(() => {
                        resolve(true)
                    })
                    .catch((err) => {
                        reject(err)
                    })
                    .finally(() => connectedClient.unbind())
            })
            .catch((err) => resolve(false))
    });
}

export const searchUser = (username, password) => {

    return new Promise((resolve, reject) => {
        createUserConnection(username, password)
            .then((connectedClient) => {
                connectedClient.unbind()
                resolve(true);
            })
            .catch(() => resolve(false))
    });

}