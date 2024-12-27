import { mutation } from 'astraql';

const CreateAcquisitionMutation = mutation`
    createAcquisition($payload: CreateAcquisitionDTO!) {
        createAcquisition(payload: $payload) {
            _id
            isGift
            gifterProfileId
            profileId
            productId
            productType
        }
    }
`;

export default CreateAcquisitionMutation;
