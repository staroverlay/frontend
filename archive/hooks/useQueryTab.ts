import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

type Indexes = { [key in string]: number };

const useQueryTab = (indexes: Indexes) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [tabIndex, setTabIndex] = useState(0);
    const prevTabIndexRef = useRef<number>(tabIndex);

    useEffect(() => {
        const key = Object.keys(indexes).find(key => indexes[key] === tabIndex);

        if (key !== undefined && prevTabIndexRef.current !== tabIndex) {
            prevTabIndexRef.current = tabIndex;

            const newQuery = { ...router.query };
            if (tabIndex !== 0) {
                newQuery.tab = key;
            } else {
                delete newQuery.tab;
            }

            router.push({
                pathname: router.pathname,
                query: newQuery,
            }, undefined, { shallow: true });
        }
    }, [tabIndex]);

    useEffect(() => {
        const tab = searchParams.get('tab');
        const newIndex = indexes[tab as string] || 0;

        if (newIndex !== tabIndex) {
            setTabIndex(newIndex);
        }
    }, [searchParams]);

    return { tabIndex, setTabIndex };
};

export default useQueryTab;
