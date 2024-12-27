import { query } from 'astraql';

const GetAcquisitionsQuery = query`
    getAcquisitions {
        getAcquisitions {
            _id
            isGift
            gifterProfileId
            profileId
            productId
            productType
        }
    }
`;

export default GetAcquisitionsQuery;
