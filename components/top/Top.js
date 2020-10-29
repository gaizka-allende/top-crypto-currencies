import React, { useEffect, useState } from 'react';
import { ajax } from 'rxjs/ajax';
import { timer } from 'rxjs';
import sortBy from 'lodash/sortBy';
import map from 'lodash/map';
import numeral from 'numeral';
import clsx from 'clsx';

const request = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,XRP,USDT,BCH,BSV,LTC,EOS,BNB,XTZ&tsyms=USD';
const currencyFormat = '$0,0[.]00';
const percentageFormat = '0[.]00';

const poll = timer(0, 5000);

function App() {
  const [data, setData] = useState(null);
  useEffect(() => {
    poll.subscribe(() => {
      const prices$ = ajax.getJSON(request);
      prices$.subscribe(
        res => {
          setData(
            sortBy(
              map(res.RAW,
                (({
                  USD,
                }) => {
                  const {
                    FROMSYMBOL,
                    PRICE,
                    OPENDAY,
                    CHANGEPCT24HOUR,
                  } = USD;

                  return ({
                    symbol: FROMSYMBOL,
                    price: PRICE,
                    openingPrice: OPENDAY,
                    difference: OPENDAY - PRICE,
                    changePct24Hour: CHANGEPCT24HOUR,
                  })
                }),
              ),
              [function(o) { return o.changePct24Hour; }],
            ).reverse()
          );
        },
        err => console.error(err)
      )
    });
  }, [])
  if (data === null) {
    return (
      <>
        <div className="loading">Loading</div>
        <style jsx>{`
          .loading {
            color: green;
            margin: 0 auto;
          }
        `}</style>
      </>
    )
  }
  return (
    <>
      <div className="app">
        <table className="table">
          <thead>
            <tr>
              <th>Coin Name</th>
              <th>Current Price (USD)</th>
              <th>Opening price (USD)</th>
              <th>Price Increase↓</th>
            </tr>
          </thead>
          <tbody>
            {
              data.map(({symbol, price, openingPrice, difference, changePct24Hour}, index) => (
                <tr key={index} className="row">
                  <td className="cell">{symbol}</td>
                  <td className="cell">{numeral(price).format(currencyFormat)}</td>
                  <td className="cell">{numeral(openingPrice).format(currencyFormat)}</td>
                  <td className={clsx('cell', difference > 0 ? 'positive' : 'negative')}>
                    {`${difference < 0 ? '-' : ''}${numeral(changePct24Hour).format(percentageFormat)}% (${numeral(difference).format(currencyFormat)})`}
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      <style jsx>{`
        .app {
          max-width: 1024px;
          margin: 200px auto 0 auto;
        }
        .table {
          margin: 0 auto;
        }
        .row {
          background-color: #fff;
          border-top: 1px solid #c6cbd1;
        }
        .row:nth-child(2n) {
          background-color: #f6f8fa;
        }
        .cell {
          padding: 6px 13px;
        }
        .positive {
          background-color: green;
        }
        .negative {
          background-color: red;
        }
      `}</style>
    </>
  );
}

export default App;
