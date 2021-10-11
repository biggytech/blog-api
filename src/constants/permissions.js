const PERMISSIONS = {
    WRITE: 'write',
    UPDATE: 'update',
    DELETE: 'delete',
    
    getAll() {
        return [this.WRITE, this.UPDATE, this.DELETE];
    }
};

module.exports = PERMISSIONS;