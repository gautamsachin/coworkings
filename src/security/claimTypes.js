// The long claim types are well-known claim types which are standard across different platforms like .net, java etc
var claimTypes = {
    name: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
    nameIdentifier: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
    email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
    user_id: 'claims/user_id',
    tokenVersion: 'claims/tversion',
    roles: 'claims/roles',
    role_company: 'Company',
    role_admin: 'Admin',
    affiliateManager: 'affiliateManager',
    admin: 'admin',
    tokenId: 'claims/tokenId'
}

module.exports = claimTypes;