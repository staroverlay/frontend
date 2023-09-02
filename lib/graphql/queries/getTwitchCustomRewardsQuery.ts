import { query } from "astraql";

const GetTwitchCustomRewardsQuery = query`
    getTwitchCustomRewards {
        getTwitchCustomRewards {
            broadcaster_id
            broadcaster_login
            broadcaster_name
            id
            title
            prompt
            cost
            background_color
            image {
                url_1x
                url_2x
                url_4x
            }
            default_image {
                url_1x
                url_2x
                url_4x
            }
        }
    }
`;

export default GetTwitchCustomRewardsQuery;
