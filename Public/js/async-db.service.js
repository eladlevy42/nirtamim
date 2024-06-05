async function postStore(storeData) {
    try {
        const response = await storeService.postStore(storeData);
        return response;
    } catch (error) {
        console.error('Error posting store:', error);
        throw error;
    }
}
async function updateStore(storeId, updateData) {
    try {
        const response = await storeService.updateStore(storeId, updateData);
        return response;
    } catch (error) {
        console.error('Error updating store:', error);
        throw error;
    }
}

async function deleteStore(storeId) {
    try {
        const response = await storeService.deleteStore(storeId);
        return response;
    } catch (error) {
        console.error('Error deleting store:', error);
        throw error;
    }
}

async function getStoreById(storeId) {
    try {
        const response = await storeService.getStoreById(storeId);
        return response;
    } catch (error) {
        console.error('Error fetching store by ID:', error);
        throw error;
    }
}
async function getAllOwnerStores(ownerId) {
    try {
        const response = await storeService.getAllOwnerStores(ownerId);
        return response;
    } catch (error) {
        console.error('Error fetching all stores for owner:', error);
        throw error;
    }
}