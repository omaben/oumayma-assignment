import { Box, Stack, Tooltip, Typography, TypographyProps } from '@mui/material';
import { Check, Copy, Eye, EyeSlash } from '@phosphor-icons/react';
import Link from 'next/link';
import { useState } from 'react';
import { Link as MuiLink} from '@mui/material';

export interface PortalCopyValueProps extends TypographyProps {
  value: string;
  hideText?: boolean;
  isVisible?: boolean;
  href?: string;
  target?: string;
  json?: {};
  title?: string;
  tooltip?: boolean;
  onclick?: Function;
  copyHoverOnly?: boolean;
  completeValue?: string;
}

const PortalCopyValue = ({
  value,
  hideText,
  isVisible,
  href,
  variant,
  target,
  json,
  title,
  tooltip,
  onclick,
  completeValue,
  copyHoverOnly,
  ...props
}: PortalCopyValueProps) => {
  const [checked, setChecked] = useState(false);
  const [show, setShow] = useState(false);
  const [dataValue, setDataValue] = useState<string>(value);
  const handleCopyButtonClick = () => {
    const data = json ? JSON.stringify(json, null, 2) : completeValue ? completeValue : value;
    navigator.clipboard.writeText(data);
    setChecked(true);
    setTimeout(() => setChecked(false), 1000);
  };

  const handleShowHideButtonClick = () => {
    if (completeValue) {
      show ? setDataValue(value) : setDataValue(completeValue);
    }
    setShow(!show);
  };

  return (
    <Stack
      direction={['row', null, 'row']}
      gap={0.5}
      alignItems="center"
      sx={{
        ...props.sx,
        cursor: 'pointer',
        '.copyIcon': {
          display: copyHoverOnly ? 'none' : 'initial',
        },
        ':hover': {
          '.copyIcon': { display: 'initial' },
        },
      }}
    >
      {!hideText &&
        (href ? (
          <Box>
            <MuiLink component={Link} target={target} href={href}>
              {title && title}
              {dataValue}
            </MuiLink>
          </Box>
        ) : (
          <Typography
            sx={{
              ...props.sx,
            }}
            variant="subtitle2"
            onClick={() => (onclick ? onclick() : {})}
          >
            {title && title} {dataValue}
          </Typography>
        ))}
      {completeValue && (
        <Stack
          onClick={() => {
            handleCopyButtonClick();
          }}
        >
          <Tooltip title={completeValue}>
            <Box
              component="svg"
              sx={{
                cursor: 'pointer',
                width: 20,
                height: 20,
                path: {
                  stroke: 'unset !important',
                },
              }}
            >
              {checked ? <Check /> : <Copy className="copyIcon" />}
            </Box>
          </Tooltip>
        </Stack>
      )}
      {isVisible && (
        <Stack
          onClick={() => {
            handleShowHideButtonClick();
          }}
        >
          <Box
            component="svg"
            sx={{
              cursor: 'pointer',
              width: 20,
              height: 20,
              path: {
                stroke: 'unset !important',
              },
            }}
          >
            {show ? <Eye /> : <EyeSlash />}
          </Box>
        </Stack>
      )}
    </Stack>
  );
};

export default PortalCopyValue;
