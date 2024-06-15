import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

type Indexes = { [key in string]: number }

const useQueryTab = (indexes: Indexes) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [tabIndex, setTabIndex] = useState(0);

    useEffect(() => {
        for (const [key, value] of Object.entries(indexes)) {
            if (value === tabIndex) {
                if (tabIndex !== 0)
                    router.query.tab = key
                else
                    delete router.query.tab
                router.push(router)
            }
        }
    }, [tabIndex]);


    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) {
            const newIndex = indexes[tab] || 0;
            setTabIndex(newIndex);
        } else {
            setTabIndex(0)
        }
    }, [router]);

    return { tabIndex, setTabIndex };
};

export default useQueryTab;
