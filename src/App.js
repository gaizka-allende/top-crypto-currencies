import React, { useEffect, useState } from 'react';
import axios from 'axios';
import sortBy from 'lodash/sortBy';
import map from 'lodash/map';
import numeral from 'numeral';

const request = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,XRP,USDT,BCH,BSV,LTC,EOS,BNB,XTZ&tsyms=USD';
const currencyFormat = '$ 0,0[.]00';
const percentageFormat = '0[.]00';

function App() {
  const [data, setData] = useState(null);
  useEffect(() => {
      const fetchData = async () => {
        const result = await axios(request);
        console.log(result);
        setData(
          sortBy(
            map(result.data.RAW,
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
    };

    fetchData();
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
  console.log(data);
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
                  <td className="cell">
                    {`${numeral(changePct24Hour).format(percentageFormat)}% (${numeral(difference).format(currencyFormat)})`}
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
      `}</style>
    </>
  );
}

export default App;
