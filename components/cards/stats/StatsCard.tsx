import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import { getGradient, Gradient } from '../../../theme/gradients';
import styles from './StatsCard.module.css';

interface StatsCardProps {
  title: string;
  value: string;
  bg?: string;
  grad?: Gradient;
  icon?: React.ReactNode;
  maxValue?: string;
  unit?: string;
}

export default function StatsCard({
  title,
  value,
  maxValue,
  unit,
  bg,
  grad,
}: StatsCardProps) {
  const displayValue = maxValue ? `${value}/${maxValue}` : value;
  const background = grad ? getGradient(grad as Gradient) : bg;

  return (
    <Flex className={styles.card} bg={background}>
      <Box className={styles.title}>{title}</Box>
      <Box className={styles.value}>
        {displayValue} {unit}
      </Box>
    </Flex>
  );
}
