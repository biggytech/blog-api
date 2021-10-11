function checkPermission(user, permission) {
    return user.permissions.indexOf(permission) !== -1;
}

module.exports = checkPermission;