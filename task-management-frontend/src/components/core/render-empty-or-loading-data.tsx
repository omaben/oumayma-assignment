import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';

interface RenderEmptyOrLoadingDataProps {
  length: number;
  isLoading: boolean;
  text: string;
}

const RenderEmptyOrLoadingData: React.FC<RenderEmptyOrLoadingDataProps> = ({ length, isLoading, text }) => {
  if (length === 0 && !isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="text.secondary" sx={{ textAlign: 'center' }} variant="body2">
          {text}
        </Typography>
      </Box>
    );
  }

  if (isLoading) {
    return <CircularProgress className="circularProgress" />;
  }

  return null;
};

export default RenderEmptyOrLoadingData;
