import {
  Badge,
  Card,
  CardBody,
  Flex,
  Heading,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Text
} from '@chakra-ui/react';
import Link from 'next/link';
import {
  FaDollarSign,
  FaDownload,
  FaEllipsisV,
  FaEye,
  FaLink,
  FaLock
} from 'react-icons/fa';

import ITemplate from '@/services/templates/template';
import TemplateVisibility from '@/services/templates/template-visibility';

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

export const VisibilityBadge = ({
  visibility,
}: {
  visibility: TemplateVisibility;
}) => (
  <Badge colorScheme={colors[visibility]}>
    <Flex className={styles.flex}>
      {icons[visibility]} {visibility}
    </Flex>
  </Badge>
);

export const PriceBadge = ({ price }: { price: number }) => (
  <Badge colorScheme={'green'}>
    <Flex alignItems={'center'}>
      {price > 0 && (
        <>
          <FaDollarSign /> {price.toFixed(2)}
        </>
      )}

      {price === 0 && 'Free'}
    </Flex>
  </Badge>
);

export default function TemplateCard(props: TemplateCardProps) {
  const { template } = props;

  const context = props.context || 'explorer';
  const isEditor = props.context == 'editor';
  const isExplorer = context === 'explorer';
  const isEditorOrExplorer = isEditor || isExplorer;

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
        <Link href={`/creator/templates/${template._id}/update?tab=editor`}>
          <MenuItem color={'orange.400'}>Source Code</MenuItem>
        </Link>
        <MenuItem>Clone</MenuItem>

        <MenuDivider />

        {/* Shared menu */}
        <Link href={`/marketplace//${template._id}`}>
          <MenuItem>View store page</MenuItem>
        </Link>
        <MenuItem color={'cyan.400'}>Copy link</MenuItem>
        <MenuItem color={'red.400'} onClick={() => props.onDelete(template)}>
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  );

  const CardElement = () => {
    return (
      <Card
        cursor={'pointer'}
        transition={'all 140ms ease-in-out'}
        _hover={{
          boxShadow: '0 0 10px 0 rgba(0,0,0,0.2)',
          transform: 'scale(1.03)',
        }}
      >
        <Flex className={styles.thumbnail} justifyContent={'center'}>
          {template.thumbnail && (
            <Image
              src={`${process.env.NEXT_PUBLIC_R2_WORKER}/${template.thumbnail}`}
              alt={'Thumbnail'}
              width={'100%'}
              height={'100%'}
            />
          )}

          {!template.thumbnail && (
            <Flex
              bg={'blue.100'}
              w={'100%'}
              h={'100%'}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <Text
                color={'black'}
                fontSize={'18px'}
                fontWeight={'600'}
                wordBreak={'break-word'}
              >
                {template.name}
              </Text>
            </Flex>
          )}
        </Flex>

        <CardBody>
          <Stack spacing="2">
            <Flex className={styles.flex} justifyContent={'space-between'}>
              <Heading size="md">{template.name || 'Unnamed Template'}</Heading>
              {!isEditorOrExplorer && <OptionsButton />}
            </Flex>

            {!isExplorer && (
              <Flex className={styles.flex}>
                <VisibilityBadge visibility={template.visibility} />
                <PriceBadge price={template.price || 0} />
              </Flex>
            )}

            <Text>{template.description || 'No description provided'}</Text>

            <Flex className={styles.author}>
              {isExplorer && (
                <Link
                  href={`/users/${template.creatorId}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  By {template.creatorId}
                </Link>
              )}

              {isEditor && <Text>By you ({template.creatorId})</Text>}

              <Flex className={styles.flex} gap={'10px'}>
                <Flex className={styles.flex}>
                  <FaEye /> 0
                </Flex>
                <Flex className={styles.flex}>
                  <FaDownload /> 0
                </Flex>
              </Flex>
            </Flex>
          </Stack>
        </CardBody>
      </Card>
    );
  };

  return isExplorer ? (
    <Link href={`/marketplace/${template._id}`}>
      <CardElement />
    </Link>
  ) : (
    <CardElement />
  );
}
