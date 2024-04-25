import { query } from 'astraql';

const GetAllMediaQuery = query`
    getAllMedia {
        getAllMedia {
            _id
            name
            size
            type
            userId
        }
    }
`;

export default GetAllMediaQuery;
