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
import CopyToClipboard from 'react-copy-to-clipboard';
import { FaEllipsisV } from 'react-icons/fa';

import ITemplate from '@/services/templates/template';
import IWidget from '@/services/widgets/widget';

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
  const link = `${process.env.NEXT_PUBLIC_WIDGET_SERVER}${widget.token}`;

  const OptionsButton = () => (
    <Menu>
      <MenuButton as={IconButton} icon={<FaEllipsisV />} variant={'ghost'} />
      <MenuList>
        {/* Streamer menu */}
        <Link href={`/widgets/${widget._id}`}>
          <MenuItem color={'green.400'}>Edit</MenuItem>
        </Link>

        <CopyToClipboard text={link}>
          <MenuItem color={'cyan.400'}>Copy</MenuItem>
        </CopyToClipboard>

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
    <Card>
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
            Created from{' '}
            <Link href={`/marketplace/${widget.templateId}`}>
              {template.name}
            </Link>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
}
