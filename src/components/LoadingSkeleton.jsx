import { Skeleton, Stack } from '@mui/material';

export default function LoadingSkeleton({ rows = 4 }) {
  return (
    <Stack spacing={1.5}>
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} variant="rounded" height={index === 0 ? 54 : 38} />
      ))}
    </Stack>
  );
}
