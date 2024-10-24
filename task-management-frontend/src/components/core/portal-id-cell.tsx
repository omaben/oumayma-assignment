import { Box } from '@mui/material';
import { PlusCircle as PlusCircleIcon } from '@phosphor-icons/react/dist/ssr/PlusCircle';

import { stringToHash } from '@/lib/helper';

import PortalCopyValue from './portal-copy-value';

export function PortalIDCell(value: string, color: string, link?: string, addToFilter?: Function) {

  const renderValue = stringToHash(value);

  return value ? (
    <Box
      display={'inline-flex'}
      alignItems={'center'}
      sx={{
        alignItems: 'center',
        svg: { cursor: 'pointer', '&.eyeIcon': { marginRight: '5px', position: 'relative' } },
        ':hover': {
          '.filterIcon': { opacity: 1 },
        },
      }}
    >
      {/* <Eye onClick={toggleShowHash} className="eyeIcon" /> */}
      <PortalCopyValue
        value={renderValue}
        href={link}
        target={'_blank'}
        completeValue={value}
        sx={{
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          justifyContent: 'center !important',
          textAlign: 'center !important',
        }}
      />
      {addToFilter && (
        <Box
          className="filterIcon"
          sx={{
            opacity: 0,
            transition: 'opacity 0.3s ease',
            cursor: 'pointer',
          }}
        >
          <PlusCircleIcon size={15} onClick={() => addToFilter(value)} />
        </Box>
      )}
    </Box>
  ) : (
    <Box>--</Box>
  );
}
