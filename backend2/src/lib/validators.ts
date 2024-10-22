import { Country, State } from 'country-state-city';

const UUID_V4_REGEX = RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);

export const isValidUuid = (value?: string): boolean => {
  return UUID_V4_REGEX.test(value);
};

export const isValidCountry = (country: string) => {
  const countries = Country.getAllCountries();
  const countriesIsoCodes = countries.map((c) => c.isoCode);

  return countriesIsoCodes.includes(country);
};

export const isValidState = (state: string, country?: string) => {
  let states = [];

  if (country) {
    states = State.getStatesOfCountry(country);
  } else {
    states = State.getAllStates();
  }

  const statesIsoCodes = states.map((s) => s.isoCode);

  return statesIsoCodes.includes(state);
};

export const validateCountryAndState = ({
  country,
  state,
}: {
  country?: string;
  state?: string;
}): { error: string } => {
  let error = '';

  if (country) {
    const invalidCountry = !isValidCountry(country);
    const invalidState = state && !isValidState(state, country);

    if (invalidCountry || invalidState) {
      error = 'Invalid Country or invalid State.';
    }
  } else if (state && !isValidState(state)) {
    error = 'Invalid State.';
  }

  return { error };
};
