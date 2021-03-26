import React, { useEffect, useState } from "react";
import {
  Grid,
  Header,
  Dimmer,
  Loader,
  Segment,
  Button
} from "semantic-ui-react";

import { connect } from "react-redux";

import Moment from "moment";

import { YearDropdown } from "../components/YearDropdown";
import { MonthDropdown } from "../components/MonthDropdown";
import { PaginatedTransactionsTable } from "../components/PaginatedTransactionsTable";
import { fetchTransactions, fetchAccountDetails } from "../actions";

import {
  getUser,
  getTransactions,
  getTotal,
} from "../reducers";

function Transactions({
  transactions,
  total,
  user,
  fetchTransactions,
  fetchAccountDetails
}) {

  const itemsPerPage = 10;

  const [filterByMonth, setFilterByMonth] = useState(undefined)
  const [filterByYear, setFilterByYear] = useState(undefined)
  const [skip, setSkip] = useState(0)

  useEffect(() => {
  
    if (!user) {
      fetchAccountDetails();
    }

    let fromDate = "";
    let toDate = "";
    if (filterByYear && filterByMonth) {
      fromDate = Moment(
        `01-${filterByMonth}-${filterByYear}`,
        "D-M-YYYY"
      ).toISOString();
      toDate = Moment(
        `31-${filterByMonth}-${filterByYear}`,
        "D-M-YYYY"
      ).toISOString();
    } else if (filterByYear) {
      fromDate = Moment(`01-01-${filterByYear}`, "D-M-YYYY").toISOString();
      toDate = Moment(`31-12-${filterByYear}`, "D-M-YYYY").toISOString();
    }

      fetchTransactions(fromDate, toDate, itemsPerPage, skip);
    
  }, [fetchTransactions, fetchAccountDetails, user, filterByMonth, filterByYear, skip]);



  const handleYearFilterChanged = (event, { value }) => {
    setFilterByYear(value);
    setSkip(0);
  };

  const handleMonthFilterChanged = (event, { value }) => {
    setFilterByMonth(value);
    setSkip(0);
  };

  const handleClearFilters = () => {
    setFilterByYear(null);
    setFilterByMonth(null);
    setSkip(0);
  };


  if (!transactions) {
    return (
      <Dimmer active inverted>
        <Loader inverted>Loading</Loader>
      </Dimmer>
    );
  }

  return (
    <Segment.Group>
      <Segment>
        <Header as="h1">
          All Transaktionen des Accounts {user.accountNr}
        </Header>
      </Segment>
      <Segment>
        <Grid>
          <Grid.Column width={8}>
            <YearDropdown
              value={filterByYear}
              onChange={handleYearFilterChanged}
            />
          </Grid.Column>
          <Grid.Column width={7}>
            <MonthDropdown
              onChange={handleMonthFilterChanged}
              value={filterByMonth}
            />
          </Grid.Column>
          <Grid.Column width={1}>
            <Button fluid icon="remove" onClick={handleClearFilters} />
          </Grid.Column>
        </Grid>
        {transactions.length > 0 ? (
          <PaginatedTransactionsTable
            user={user}
            transactions={transactions}
            skip={skip}
            total={total}
            onBack={() => {
              setSkip(skip - itemsPerPage);
            }}
            onForward={() => {
              setSkip(skip + itemsPerPage);
            }
            }
          />
        ) : (
          <p>In diesem Zeitraum wurden keine Transaktionen getätigt</p>
        )}
      </Segment>
    </Segment.Group>
  );
}


const mapStateToProps = (state) => {
  return {
    transactions: getTransactions(state),
    user: getUser(state),
    total: getTotal(state)
  };
};

const mapDispatchToProps = {
  fetchTransactions,
  fetchAccountDetails
};


export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
