import {
  Badge,
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FaEllipsisV } from 'react-icons/fa';

import ITemplate from '@/lib/interfaces/template';
import IWidget from '@/lib/interfaces/widget';

import styles from './WidgetCard.module.css';

export interface WidgetCardProps {
  widget: IWidget;
  onClone: (widget: IWidget) => void;
  onDelete: (widget: IWidget) => void;
}

export default function WidgetCard({
  widget,
  onClone,
  onDelete,
}: WidgetCardProps) {
  const template = JSON.parse(widget.templateRaw) as ITemplate;

  const OptionsButton = () => (
    <Menu>
      <MenuButton as={IconButton} icon={<FaEllipsisV />} variant={'ghost'} />
      <MenuList>
        {/* Streamer menu */}
        <Link href={`/widgets/${widget._id}`}>
          <MenuItem color={'green.400'}>Edit</MenuItem>
        </Link>
        <MenuItem color={'cyan.400'}>Copy link</MenuItem>

        <MenuDivider />

        {/* Quick actions menu */}
        <MenuItem onClick={() => onClone(widget)}>Clone</MenuItem>
        <MenuItem color={'red.400'} onClick={() => onDelete(widget)}>
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  );

  return (
    <Card className={styles.card}>
      <CardBody>
        <Stack spacing="2">
          <Flex className={styles.flex} justifyContent={'space-between'}>
            <Heading size="md">
              {widget.displayName || 'Unnamed Widget'}

              <Badge ml={'10px'} colorScheme={widget.enabled ? 'green' : 'red'}>
                {widget.enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </Heading>
            <OptionsButton />
          </Flex>

          <Box className={styles.author}>
            From{' '}
            <Link href={`/store/templates/${widget.templateId}`}>
              {template.name}
            </Link>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
}
