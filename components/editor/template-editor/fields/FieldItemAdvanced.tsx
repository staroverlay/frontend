import {
  FieldArraySettings,
  FieldBooleanSettings,
  FieldEnumSettings,
  FieldMapSettings,
  FieldNumberSettings,
  FieldStringSettings,
  ITemplateAdvancedField,
  TemplateFieldType,
} from "@/lib/interfaces/template-field";
import { useEffect, useState } from "react";
import ArrayFieldItem from "./advanced/ArrayFieldItem";
import BooleanFieldItem from "./advanced/BooleanFieldItem";
import MapFieldItem from "./advanced/MapFieldItem";
import NumberFieldItem from "./advanced/NumberFieldItem";
import StringFieldItem from "./advanced/StringFieldItem";

interface FieldItemAdvancedProps {
  type: TemplateFieldType;
  setValue: (value: ITemplateAdvancedField) => unknown;
  stringOptions?: FieldStringSettings;
  numberOptions?: FieldNumberSettings;
  booleanOptions?: FieldBooleanSettings;
  mapOptions?: FieldMapSettings;
  arrayOptions?: FieldArraySettings;
  enumOptions?: FieldEnumSettings;
}

export default function FieldItemAdvanced({
  type,
  setValue,
  ...props
}: FieldItemAdvancedProps) {
  const [cacheType, setCacheType] = useState<TemplateFieldType>("string");
  const [string, setString] = useState(props.stringOptions || {});
  const [number, setNumber] = useState(props.numberOptions || {});
  const [boolean, setBoolean] = useState(props.booleanOptions || {});
  const [map, setMap] = useState<FieldMapSettings>(
    props.mapOptions || { key: "string", value: "string" }
  );
  const [array, setArray] = useState<FieldArraySettings>(
    props.arrayOptions || { type: "string" }
  );
  const [_enum, setEnum] = useState(props.enumOptions || {});

  useEffect(() => {
    if (cacheType != type) {
      setCacheType(type);
    }
  }, [cacheType, type]);

  useEffect(() => {
    const getSelected = () => {
      switch (cacheType) {
        case "array":
          return array;
        case "boolean":
          return boolean;
        case "enum":
          return _enum;
        case "map":
          return map;
        case "number":
          return number;
        case "string":
          return string;
        default:
          return null;
      }
    };

    const key = cacheType;
    const value = getSelected();
    const obj: { [key: string]: unknown } = {};
    obj[key] = value;
    setValue(obj);
  }, [cacheType, string, number, boolean, map, array, _enum, setValue]);

  if (type == "string") {
    return <StringFieldItem settings={string} onUpdate={setString} />;
  } else if (type == "array") {
    return <ArrayFieldItem settings={array} onUpdate={setArray} />;
  } else if (type == "number") {
    return <NumberFieldItem settings={number} onUpdate={setNumber} />;
  } else if (type == "boolean") {
    return <BooleanFieldItem settings={boolean} onUpdate={setBoolean} />;
  } else if (type == "map") {
    return <MapFieldItem settings={map} onUpdate={setMap} />;
  } else {
    return <></>;
  }
}
