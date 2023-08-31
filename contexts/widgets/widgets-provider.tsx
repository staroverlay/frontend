import { PropsWithChildren, useEffect, useState } from "react";

import IMembership from "@/lib/interfaces/membership";
import { WidgetsContext } from "./widgets-context";
import Loading from "@/components/layout/loading";
import { getMyWidgets } from "@/lib/services/widget-service";
import IWidget from "@/lib/interfaces/widget";

export function WidgetsProvider({ children }: PropsWithChildren) {
  const [widgets, setWidgets] = useState<IWidget[]>([]);
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
    setFetched(true);
  }, [widgets]);

  useEffect(() => {
    if (!fetched) {
      getMyWidgets().then(setWidgets);
    }
  }, [fetched]);

  return (
    <WidgetsContext.Provider
      value={{ addWidget, removeWidget, updateWidget, widgets }}
    >
      <Loading loaded={fetched} message={"Loading membership"}>
        {children}
      </Loading>
    </WidgetsContext.Provider>
  );
}
