import React, { useEffect, useMemo, useState } from 'react';
import { Grid } from '@material-ui/core';
import RoomList from '../shared/RoomList';
import '../../styles/Dashboard.scss';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import queries from '../../queries';
import MyList from './MyList';

const StockItem = ({name, prices}) => {
  const current = prices.find((item) => item.date === 'c').value;
  const prev = prices.find((item) => item.date === 'pc').value;
  const change = Math.round((current - prev)*100)/100;
  const value = change > 0 ? '+' + change.toFixed(2) : '' + change.toFixed(2);
  const percent = Math.round((change / prev) * 10000) / 100;
  const percentValue = percent > 0 ? '+' + percent.toFixed(2) : '' + percent.toFixed(2);


  return (
    <Grid item xs={12} sm={4} className="top-stock-item-container">
      <div className='top-stock-item'>
        {name}
        <div className="top-stock-price">
          <span className={change > 0 ? 'positive' : 'negative'}>{value}</span>
          <span className={percent > 0 ? 'positive' : 'negative'}>({percentValue})%</span>
        </div>
      </div>
    </Grid>
  )

}
StockItem.propTypes = {
  name: PropTypes.string.isRequired,
  prices: PropTypes.array.isRequired,
}

const TopStockTickers = () => {

  const { loading, data } = useQuery(queries.GET_INDEXES);
  const [stockData, setStockData] = useState(null);

  useEffect(() => {
    if (data && data.indexes) {
      setStockData(data.indexes);
    }
  }, [data])
  
  return (
    !loading && stockData
      ? <Grid container className="full-height">
        <StockItem name="NASDAQ" prices={stockData.NASDAQ.prices}/>
        <StockItem name="SP500" prices={stockData.SP.prices}/>
        <StockItem name="Dow Jones" prices={stockData.DOW.prices}/>
      </Grid>
      : <div>Loading...</div>
    
  )

}

const Dashboard = () => {

  const allRoomsQuery = useQuery(queries.GET_ALL_ROOMS, {fetchPolicy: 'no-cache'});
  const topMoversQuery = useQuery(queries.GET_TOP_MOVERS, {fetchPolicy: 'no-cache'});
  const popularQuery = useQuery(queries.GET_POPULAR, {fetchPolicy: 'no-cache'});
  
  const loading = useMemo(() => allRoomsQuery.loading, [allRoomsQuery]);
  const [activeRooms, setActiveRooms] = useState(null);
  const [topMovers, setTopMovers] = useState(null);
  const [popular, setPopular] = useState(null);
  useEffect(() => {

    if(allRoomsQuery.data &&  allRoomsQuery.data.rooms){

      setActiveRooms(allRoomsQuery.data.rooms);
    
    }else {
      setActiveRooms(null);
    }
  
  }, [allRoomsQuery])

  useEffect(() => {

    if(topMoversQuery.data &&  topMoversQuery.data.topMovers){
      setTopMovers( topMoversQuery.data.topMovers );
    
    }else {
      setTopMovers(null);
    }
  
  }, [topMoversQuery])

  useEffect(() => {

    if(popularQuery.data &&  popularQuery.data.getTopMentions){
      setPopular( popularQuery.data.getTopMentions );
    }else {
      setPopular(null);
    }
  
  }, [popularQuery])

  return (
    loading ? <div>Loading...</div>
      : (
        <Grid container spacing={3} id="dashboard">
          <Grid item xs={12} sm={9} id="right-dashboard">
            <Grid item xs={12} className="top-stocks" id="top-stocks">
              <TopStockTickers/>
            </Grid>
            <Grid container>
              <Grid item xs={12} sm={4} className='list-container'>
                {
                  topMovers
                    ? <RoomList title="Top Movers" showPrices tickerList={topMovers} />
                    : <div>Loading...</div>
                }
              </Grid>
              <Grid item xs={12} sm={4} className='list-container'>
                {
                  popular
                    ? <RoomList title="Popular" showPrices tickerList={popular} />
                    : <div>Loading...</div>
                }
              </Grid>
              <Grid item xs={12} sm={4} className='list-container'>
                <MyList/>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={3} id="active-rooms">
            {
              activeRooms
                ? <RoomList title="Active Rooms" sortActive tickerList={activeRooms} />
                : <div>Loading...</div>
            }
          </Grid>
        </Grid>
      )
  )

}

export default Dashboard;
