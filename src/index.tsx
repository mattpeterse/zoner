import React from 'react';
import ReactDOM from 'react-dom';

import { Line } from 'react-chartjs-2';

import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component<any, any> {
    constructor(props:any) {
        super(props);

        this.state = {
            classes: []
        }

        this.loadData.bind(this);

        this.loadData();
    }

    async loadData() {

        const response = await fetch('./otf.json');
        const otfData = await response.json();

        const classes = otfData.classes.records.map((item:any) => ({
            meta: {
                id: item.CLASSID,
                timestamp: item.class_date_obj.sec,
                name: item.class_name,
                date: item.class_date,
                time: item.class_time,
                duration: item.duration,
                trainer: item.trainer,
            },
            calories: item.CALORIES,
            points: item.points,
            heartRate: {
                average: {
                    bpm: item.hrAvg,
                    percent: item.hrPercentAvg
                },
                max: {
                    bpm: item.hrMax,
                    percent: item.hrPercentMax,
                }
            },
            zones: [
                {
                    time: item.zoneTime.blueTime,
                    seconds: item.zoneTimeSecs.blue,
                    percent: item.zonePercent.blue,
                }, {
                    time: item.zoneTime.greenTime,
                    seconds: item.zoneTimeSecs.green,
                    percent: item.zonePercent.green,
                }, {
                    time: item.zoneTime.yellowTime,
                    seconds: item.zoneTimeSecs.yellow,
                    percent: item.zonePercent.yellow,
                }, {
                    time: item.zoneTime.orangeTime,
                    seconds: item.zoneTimeSecs.orange,
                    percent: item.zonePercent.orange,
                }, {
                    time: item.zoneTime.redTime,
                    seconds: item.zoneTimeSecs.red,
                    percent: item.zonePercent.red,
                },
            ]
        })).sort((a:any, b:any) => {
            return a.meta.timestamp - b.meta.timestamp;
        });

        this.setState({ classes });
        
    }

    render() {
        return (
            <div className="container pt-4">
                {/* <div className="row">
                    <div className="col-4">
                        <div className="p-4 rounded bg-light">
                            <form onSubmit={event => { this.loadData(); event.preventDefault(); }}>
                                <button className="btn btn-primary btn-block">Load Last 50 Classes</button>
                            </form>
                        </div>
                    </div>
                </div> */}

                {this.state.classes.length> 0 &&
                    <div>
                        <div className="mb-4">
                            <Line height={100} data={{
                                labels: this.state.classes.map((item:any) => item.meta.date),
                                datasets: [{
                                    label: '% in Zone 1',
                                    data: this.state.classes.map((item:any) => item.zones[0].percent),
                                    backgroundColor: '#7f8d8e',
                                }, {
                                    label: '% in Zone 2',
                                    data: this.state.classes.map((item:any) => item.zones[1].percent),
                                    backgroundColor: '#1c81ba',
                                }, {
                                    label: '% in Zone 3',
                                    data: this.state.classes.map((item:any) => item.zones[2].percent),
                                    backgroundColor: '#08a748',
                                }, {
                                    label: '% in Zone 4',
                                    data: this.state.classes.map((item:any) => item.zones[3].percent),
                                    backgroundColor: '#F6821F',
                                }, {
                                    label: '% in Zone 5',
                                    data: this.state.classes.map((item:any) => item.zones[4].percent),
                                    backgroundColor: '#c33c24',
                                }]
                            }} options={{
                                title: {
                                    display: true,
                                    text: 'Zone Distribution by Class'
                                },
                                scales: {
                                    yAxes: [{
                                        stacked: true,
                                        ticks: { max: 105 }
                                    }],
                                }
                            }} />
                        </div>
                        <div className="mb-4">
                            <Line height={100} data={{
                                labels: this.state.classes.map((item:any) => item.meta.date),
                                datasets: [{
                                    label: 'Average Heart Rate (BPM)',
                                    data: this.state.classes.map((item:any) => item.heartRate.average.bpm),
                                    borderColor: '#000'
                                }, {
                                    label: 'Max Heart Rate (BPM)',
                                    data: this.state.classes.map((item:any) => item.heartRate.max.bpm),
                                    borderColor: '#F6821F'
                                }, {
                                    label: 'Peak Max Heart Rate (BPM)',
                                    data: this.state.classes.map((item:any) => Math.max.apply(Math, this.state.classes.map((item:any) => item.heartRate.max.bpm))),
                                    borderColor: '#c33c24',
                                    pointRadius: 0
                                }]
                            }} options={{
                                title: {
                                    display: true,
                                    text: 'Heart Rate by Class'
                                },
                            }}/>
                        </div>
                        <div className="mb-4">
                            <Line height={100} data={{
                                labels: this.state.classes.map((item:any) => item.meta.date),
                                datasets: [{
                                    label: 'Calories Burned (kcal)',
                                    data: this.state.classes.map((item:any) => item.calories),
                                    borderColor: '#000'
                                }, {
                                    label: 'Peak Calories Burned (kcal)',
                                    data: this.state.classes.map((item:any) => Math.max.apply(Math, this.state.classes.map((item:any) => item.calories))),
                                    borderColor: '#c33c24',
                                    pointRadius: 0
                                }]
                            }} options={{
                                title: {
                                    display: true,
                                    text: 'Calories Burned by Class'
                                },
                            }} />
                        </div>
                        <div className="mb-4">
                            <Line height={100} data={{
                                labels: this.state.classes.map((item:any) => item.meta.date),
                                datasets: [{
                                    label: 'Points',
                                    data: this.state.classes.map((item:any) => item.points),
                                    borderColor: '#F6821F'
                                }, {
                                    label: 'Peak Points',
                                    data: this.state.classes.map((item:any) => Math.max.apply(Math, this.state.classes.map((item:any) => item.points))),
                                    borderColor: '#c33c24',
                                    pointRadius: 0
                                }]
                            }} options={{
                                title: {
                                    display: true,
                                    text: 'Points by Class'
                                },
                            }} />
                        </div>
                    </div>
                }

                <table className="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Trainer</th>
                            <th className="text-right">KCal</th>
                            <th className="text-right">Points</th>
                            <th className="text-right">Avg HR</th>
                            <th className="text-right">Max HR</th>
                            <th className="text-right">Zone 1</th>
                            <th className="text-right">Zone 2</th>
                            <th className="text-right">Zone 3</th>
                            <th className="text-right">Zone 4</th>
                            <th className="text-right">Zone 5</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.classes.map((item:any) => (
                            <tr key={item.meta.id}>
                                <td>{item.meta.date}</td>
                                <td>{item.meta.time}</td>
                                <td>{item.meta.trainer}</td>
                                <td className="text-right">{item.calories}</td>
                                <td className="text-right">{Math.floor(item.points * 100) / 100}</td>
                                <td className="text-right">{item.heartRate.average.bpm} ({item.heartRate.average.percent}%)</td>
                                <td className="text-right">{item.heartRate.max.bpm} ({item.heartRate.max.percent}%)</td>
                                <td className="text-right">{item.zones[0].time}</td>
                                <td className="text-right">{item.zones[1].time}</td>
                                <td className="text-right">{item.zones[2].time}</td>
                                <td className="text-right">{item.zones[3].time}</td>
                                <td className="text-right">{item.zones[4].time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
  }

ReactDOM.render(<App />, document.getElementById('root'));