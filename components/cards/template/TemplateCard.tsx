import {
  Badge,
  Button,
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
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import {
  FaDollarSign,
  FaDownload,
  FaEllipsisV,
  FaEye,
  FaLink,
  FaLock,
} from 'react-icons/fa';

import ITemplate from '../../../lib/interfaces/templates/template';
import styles from './TemplateCard.module.css';

export interface TemplateCardProps {
  template: ITemplate;
  context?: 'explorer' | 'creator' | 'editor';
  onCreateWidget: (template: ITemplate) => void;
  onDelete: (template: ITemplate) => void;
}

const icons = {
  public: <FaEye />,
  private: <FaLock />,
  unlisted: <FaLink />,
};

const colors = {
  public: 'green',
  private: 'red',
  unlisted: 'orange',
};

export default function TemplateCard(props: TemplateCardProps) {
  const { template } = props;

  const context = props.context || 'explorer';
  const isEditor = props.context == 'editor';
  const isExplorer = context === 'explorer';
  const isEditorOrExplorer = isEditor || isExplorer;

  const VisibilityBadge = () => (
    <Badge colorScheme={colors[template.visibility]}>
      <Flex className={styles.flex}>
        {icons[template.visibility]} {template.visibility}
      </Flex>
    </Badge>
  );

  const PriceBadge = () => (
    <Badge colorScheme={'green'}>
      <Flex alignItems={'center'}>
        <FaDollarSign /> 5.00
      </Flex>
    </Badge>
  );

  const OptionsButton = () => (
    <Menu>
      <MenuButton as={IconButton} icon={<FaEllipsisV />} variant={'ghost'} />
      <MenuList>
        {/* Streamer menu */}
        <MenuItem
          color={'green.400'}
          onClick={() => props.onCreateWidget(template)}
        >
          Create Widget
        </MenuItem>

        <MenuDivider />

        {/* Editor menu */}
        <Link href={`/creator/templates/${template._id}`}>
          <MenuItem>Edit</MenuItem>
        </Link>
        <MenuItem>Clone</MenuItem>

        <MenuDivider />

        {/* Shared menu */}
        <Link href={`/marketplace/templates/${template._id}`}>
          <MenuItem>View store page</MenuItem>
        </Link>
        <MenuItem color={'cyan.400'}>Copy link</MenuItem>
        <MenuItem color={'red.400'} onClick={() => props.onDelete(template)}>
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
            <Heading size="md">{template.name || 'Unnamed Template'}</Heading>
            {!isEditorOrExplorer && <OptionsButton />}
          </Flex>

          {!isExplorer && (
            <Flex className={styles.flex}>
              <VisibilityBadge />
              {!isEditor && <PriceBadge />}
            </Flex>
          )}

          <Text>{template.description || 'No description provided'}</Text>

          <Flex className={styles.author}>
            {isExplorer && (
              <Link href={`/creators/${template.author.toLowerCase()}`}>
                By {template.author}
              </Link>
            )}

            {isEditor && <Text>By you ({template.author})</Text>}

            <Flex className={styles.flex} gap={'10px'}>
              <Flex className={styles.flex}>
                <FaEye /> 0
              </Flex>
              <Flex className={styles.flex}>
                <FaDownload /> 0
              </Flex>
            </Flex>
          </Flex>

          {isEditorOrExplorer && (
            <Flex className={styles.flex}>
              <Button size={'xs'} colorScheme={'pink'}>
                Use
              </Button>

              <Button size={'xs'} colorScheme={'green'}>
                Buy $5.00
              </Button>
            </Flex>
          )}
        </Stack>
      </CardBody>
    </Card>
  );
}
