import { query } from 'astraql';

const GetPlansQuery = query`
    getPlans {
        getPlans {
            _id
            isDefault
            name
            perkDesignLibrary
            perkModChat
            maxEditors
            maxStorageItems
            maxStorageSize
            maxWidgets
            price
            discountYearly
        }
    }
`;

export default GetPlansQuery;
