import { Button, ButtonGroup, Typography } from '@mui/material';
import { decrement, increment } from './counterReducer';
import { useAppDispatch, useAppSelector } from '../../app/store/store';

export default function ContactPage() {
  // The `state` arg is correctly typed as `RootState` already
  const data = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <>
      <Typography variant="h2">Contact page</Typography>
      <Typography variant="body1">The data is: {data}</Typography>
      <ButtonGroup>
        <Button onClick={() => dispatch(decrement(1))} color="error">
          Decrement
        </Button>
        <Button onClick={() => dispatch(increment(1))} color="secondary">
          Increment
        </Button>
        <Button onClick={() => dispatch(increment(5))} color="primary">
          Increment by 5
        </Button>
      </ButtonGroup>
    </>
  );
}
