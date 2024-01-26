import { Flex, IconButton, Input, Text } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { FaEraser, FaPen, FaSave, FaTrash } from 'react-icons/fa';

import useMobile from '@/hooks/useMobile';

export interface SideFieldProps {
  selected?: boolean;
  onSelect?: () => unknown;
  onRemove: () => unknown;
  onUp?: () => unknown;
  onDown?: () => unknown;
  onRename?: (name: string) => unknown;
  type: 'item' | 'category';
  children: string;
}

export default function SideField({
  children,
  selected,
  onSelect,
  onRemove,
  onRename,
  type,
}: SideFieldProps) {
  const [isHover, setIsHover] = useState(false);
  const isMobile = useMobile();
  const ref = useRef<HTMLDivElement>(null);
  const [id, setID] = useState(children);
  const [isEditMode, setIsEditMode] = useState(false);

  const bgItem = selected
    ? 'blue.300'
    : isHover
    ? 'whiteAlpha.200'
    : 'transparent';
  const bg = type === 'item' ? bgItem : 'transparent';

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleCancel = () => {
    toggleEditMode();
    setID(children);
  };

  const handleSave = () => {
    toggleEditMode();
    if (onRename) onRename(id);
  };

  useEffect(() => {
    const el = ref.current;

    if (el && children) {
      const hoverStart = () => setIsHover(true);
      const hoverEnd = () => setIsHover(false);

      el.addEventListener('pointerenter', hoverStart);
      el.addEventListener('pointerleave', hoverEnd);

      return () => {
        el.removeEventListener('pointerenter', hoverStart);
        el.removeEventListener('pointerleave', hoverEnd);
      };
    }
  }, [ref, children]);

  return (
    <Flex
      ref={ref}
      alignItems={'center'}
      justifyContent={'space-between'}
      bg={bg}
      borderRadius={'7px'}
      cursor={'pointer'}
      gap={'5px'}
      p={'5px 10px'}
      userSelect={'none'}
      width={'100%'}
      onClick={onSelect}
    >
      {isEditMode && (
        <Input
          placeholder="ID"
          value={id}
          onChange={(e) => setID(e.target.value)}
          size={'xs'}
        />
      )}

      {!isEditMode && (
        <Text fontWeight={type === 'category' ? 'bold' : 'light'}>{id}</Text>
      )}

      {(type === 'category' || isHover || isMobile) && (
        <Flex gap={'5px'}>
          {type === 'category' && (
            <IconButton
              icon={isEditMode ? <FaSave /> : <FaPen />}
              aria-label={'Edit / Save'}
              variant={'solid'}
              colorScheme={isEditMode ? 'green' : 'blue'}
              size={'xs'}
              onClick={isEditMode ? handleSave : toggleEditMode}
              disabled={id.trim() === ''}
            />
          )}

          <IconButton
            icon={isEditMode ? <FaEraser /> : <FaTrash />}
            aria-label={'Delete / Cancel'}
            variant={'solid'}
            colorScheme={'red'}
            size={'xs'}
            onClick={(e) => {
              e.stopPropagation();

              if (isEditMode) {
                handleCancel();
              } else {
                if (onRemove) onRemove();
              }
            }}
          />
        </Flex>
      )}
    </Flex>
  );
}
