import { query } from 'astraql';

const GetSessionsQuery = query`
    getSessions {
        getSessions {
            _id
            device
            date
            method
            location
        }
    }
`;

export default GetSessionsQuery;
