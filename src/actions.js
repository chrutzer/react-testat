import * as api from "./api";

export function fetchTransactions(fromDate, toDate, count, skip) {
  return (dispatch, getState) => {
    dispatch({ type: "FETCH_TRANSACTIONS_STARTED" });

    return api
      .getTransactions(getState().authentication.token, fromDate, toDate, count, skip)
      .then(({ result: transactions, query: { resultcount } }) => {
        dispatch({ type: "FETCH_TRANSACTIONS_SUCCEEDED", transactions, resultcount });
      })
      .catch((error) => dispatch({ type: "FETCH_TRANSACTIONS_FAILED", error }));
  };
}



export function fetchAccountDetails() {
  return (dispatch, getState) => {
    dispatch({ type: "FETCH_ACCOUNT_DETAILS_STARTED" });

    return api
      .getAccountDetails(getState().authentication.token)
      .then(({ amount: balance, owner: user }) => {
        dispatch({ type: "FETCH_ACCOUNT_DETAILS_SUCCEEDED", balance, user });
      })
      .catch((error) =>
        dispatch({ type: "FETCH_ACCOUNT_DETAILS_FAILED", error })
      );
  };
}

export function transfer(target, amount) {
  return (dispatch, getState) => {
    api.transfer(target, amount, getState().authentication.token).then((result) => {
      // Transfer succeeded, we just re-fetch the account details
      // instead of calculating the balance ourselves
      fetchAccountDetails(getState().authentication.token)(dispatch);
      fetchTransactions(getState().authentication.token)(dispatch);
    });
  };
}

export function authenticate(login, password) {
  return (dispatch) => {
    return api.login(login, password).then(({ token, owner }) => {
      dispatch({ type: "AUTHENTICATION_SUCCEEDED", token, user: owner });
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(owner));
    });
  };
}

export function signout(callback) {
  return (dispatch) => {
    dispatch({ type: "SIGNOUT" });
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  };
}
