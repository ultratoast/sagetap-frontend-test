import { render, screen ,  waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App, ArtItem } from './App';

function setup(jsx: any) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  }
}

test('has title', () => {
  render(<App />);
  const title = screen.getByText("Art Rater");
  expect(title).toBeInTheDocument();
});

test('for an art item, submit button is disabled until a rating is selected', async () => {
  const { user } = setup(<App />)

  const submitButtons = await screen.findAllByText('Submit');
  const submitButton = submitButtons[0]
  expect(submitButton).toBeInTheDocument();
  expect(submitButton).toBeDisabled();

  const rateButtons = await screen.findAllByText('1');
  await user.click(rateButtons[0]);
  await waitFor(() => expect(submitButton).not.toBeDisabled());
});

test('for an art item, clicking numbered button updates rating display below image to be that number', async () => {
  const { user } = setup(<App />)

  const rateButtons1 = await screen.findAllByText('1');
  await user.click(rateButtons1[0]);
  const rateText = await screen.findByText('Rating: 1');
  await expect(rateText).toBeInTheDocument();
});

test('for an art item, clicking numbered button updates rating display below image to be that number, clicking two different numbers one after the other', async () => {
  const { user } = setup(<App />)

  const rateButtons1 = await screen.findAllByText('1');
  await user.click(rateButtons1[0]);
  const rateText = await screen.findByText('Rating: 1');
  await expect(rateText).toBeInTheDocument();
  const rateButtons2 = await screen.findAllByText('2');
  await user.click(rateButtons2[0]);
  const rateText2 = await screen.findByText('Rating: 2');
  await expect(rateText2).toBeInTheDocument();

});

test('for an art item, clicking submit POSTs update, displays a toast success message, hides buttons', async () => {
  // The endpoint and payload for the submit button can be found in the submit method in `App.tsx`.
  // For the purpose of this test, please use a mock function instead.

//  const sendRating = () {
//    return {message: "Success"};
//  }

//  const { user } = setup(<App />)

//  const submitButtons = await screen.findAllByText('Submit');
//  const submitButton = submitButtons[0]

//  const rateButtons = await screen.findAllByText('1');
//  await user.click(rateButtons[0]);
//  await user.click(submitButton);
//  await expect(sendRating.mock).toHaveBeenCalled()
});
