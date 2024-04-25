import { useEffect, useState } from 'react';

import {
  FieldArraySettings,
  FieldBooleanSettings,
  FieldEnumSettings,
  FieldMapSettings,
  FieldNumberSettings,
  FieldStringSettings,
  ITemplateAdvancedField,
  TemplateFieldType,
} from '@/services/templates/template-field';

import ArrayFieldItem from './advanced/ArrayFieldItem';
import BooleanFieldItem from './advanced/BooleanFieldItem';
import MapFieldItem from './advanced/MapFieldItem';
import NumberFieldItem from './advanced/NumberFieldItem';
import StringFieldItem from './advanced/StringFieldItem';

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
  const [string, setString] = useState(props.stringOptions || {});
  const [number, setNumber] = useState(props.numberOptions || {});
  const [boolean, setBoolean] = useState(props.booleanOptions || {});
  const [map, setMap] = useState<FieldMapSettings>(
    props.mapOptions || { key: 'string', value: 'string' },
  );
  const [array, setArray] = useState<FieldArraySettings>(
    props.arrayOptions || { type: 'string' },
  );
  const [_enum, setEnum] = useState(props.enumOptions || {});

  useEffect(() => {
    const getSelected = () => {
      switch (type) {
        case 'array':
          return array;
        case 'boolean':
          return boolean;
        case 'enum':
          return _enum;
        case 'map':
          return map;
        case 'number':
          return number;
        case 'string':
          return string;
        default:
          return null;
      }
    };

    const value = getSelected();

    if (value != undefined && value != null) {
      const obj: { [key: string]: unknown } = {};
      obj[type] = value;
      setValue(obj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, string, number, boolean, map, array, _enum]);

  if (type == 'string') {
    return <StringFieldItem settings={string} onUpdate={setString} />;
  } else if (type == 'array') {
    return <ArrayFieldItem settings={array} onUpdate={setArray} />;
  } else if (type == 'number') {
    return <NumberFieldItem settings={number} onUpdate={setNumber} />;
  } else if (type == 'boolean') {
    return <BooleanFieldItem settings={boolean} onUpdate={setBoolean} />;
  } else if (type == 'map') {
    return <MapFieldItem settings={map} onUpdate={setMap} />;
  } else {
    return <></>;
  }
}
