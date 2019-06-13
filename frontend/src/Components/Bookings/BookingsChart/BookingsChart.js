import React from 'react';
import { Bar as BarChart } from 'react-chartjs';

const BOOKINGS_BUKCETS = {
    'Cheap' : {
        min: 0,
        max:100
    },
    'Reasonable' : {
        min: 101,
        max:200
    },
    'Expensive': {
        min: 201,
        max: 10000000
    }
}

const bookingsChart = props => {
    const chartData = { lables: [] , datasets : []};
    let values = [];
    for(const bucket in BOOKINGS_BUKCETS){
        const filteredBookingsCount = props.bookings.reduce( 
            () => (prev, current) => {
                if(current.event.price > BOOKINGS_BUKCETS[bucket].min && current.event.price < BOOKINGS_BUKCETS[bucket].max){
                    return prev + 1;
                }
                else{
                    return prev;
                }
            }
            ,0);
            values.push(filteredBookingsCount);
            chartData.labels.push(bucket);
            chartData.datasets.push({
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data: values
            });
            values = [...values]
            values[values.length - 1] = 0
    }

    return (<div style={{ textAlign: 'center'}}>
                <BarChart data={chartData}></BarChart>
            </div>);
};

export default bookingsChart;