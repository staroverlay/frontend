import { PropsWithChildren, useEffect, useState } from 'react';

import Loading from '@/components/layout/loading';
import useAuth from '@/hooks/useAuth';
import { getMyWidgets } from '@/services/widgets';
import IWidget from '@/services/widgets/widget';

import { WidgetsContext } from './widgets-context';

export function WidgetsProvider({ children }: PropsWithChildren) {
  const [widgets, setWidgets] = useState<IWidget[]>([]);
  const { user } = useAuth();
  const [fetched, setFetched] = useState(false);

  const addWidget = (widget: IWidget) => {
    setWidgets([...widgets, widget]);
  };

  const removeWidget = (widget: IWidget) => {
    const newWidgets = widgets.filter((w) => w._id !== widget._id);
    setWidgets([...newWidgets]);
  };

  const updateWidget = (widget: IWidget) => {
    const index = widgets.findIndex((w) => w._id === widget._id);
    widgets[index] = widget;
    setWidgets([...widgets]);
  };

  useEffect(() => {
    const fetchWidgets = async () => {
      const widgets = await getMyWidgets();
      setWidgets(widgets);
      setFetched(true);
    };

    if (user) {
      fetchWidgets();
    } else if (!fetched) {
      setFetched(true);
    }
  }, [user, fetched]);

  return (
    <WidgetsContext.Provider
      value={{ addWidget, removeWidget, updateWidget, widgets }}
    >
      <Loading loaded={fetched} message={'Loading widgets'}>
        {children}
      </Loading>
    </WidgetsContext.Provider>
  );
}
