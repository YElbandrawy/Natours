import axios from 'axios';
var stripe = Stripe(
  'pk_test_51QhJqxHz0a7dcjEbkuRukayVPwRchmx0VBoTc3848mOyukWXJbSMUoEJL6ihcyge3afYRi7Tmc7KCj1BmSHbRHks00ZSIibP5t'
);
export const bookTour = async (tourId) => {
  //get checkout session
  const session = await axios({
    method: 'POST',
    url: `https://natours-uosef.up.railway.app/api/v1/bookings/checkout-session/${tourId}`,
  });
  //create checkout form
  await stripe.redirectToCheckout({
    sessionId: session.data.session.id,
  });
};
