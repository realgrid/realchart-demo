import { Panel } from '@/components/Panels';
import { Box, Stack, createStyles } from '@mantine/core';
import { FormEventHandler } from 'react';

const useStyles = createStyles((theme) => ({
  formBox: {},
}));

export const FormPanel = ({
  title,
  span,
  onSubmit,
  children,
}: {
  title?: string;
  span?: number;
  onSubmit?: FormEventHandler<HTMLFormElement> | undefined;
  children: React.ReactNode;
}) => {
  const { classes } = useStyles();

  return (
    <Panel title={title} span={span}>
      <Box className={classes.formBox} component="form" onSubmit={onSubmit}>
        <Stack>{children}</Stack>
      </Box>
    </Panel>
  );
};
