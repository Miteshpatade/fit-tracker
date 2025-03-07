"use client"
import React from 'react'
import { LineChart } from '@mui/x-charts/LineChart';
import './ReportPage.css'
import { AiFillEdit } from 'react-icons/ai'
import CaloriIntakePopup from '@/components/ReportFormPopup/CalorieIntake/CalorieIntakePopup';

const page = () => {
    const color = '#ffc20e'

    const chartsParams = {
        height: 300,
    };

    const [dataS1, setDataS1] = React.useState<any>(null)

    const getDataForS1 = async () => {
        let temp = [
            { date: 'Thu Sep 28 2023 20:30:30 GMT+0530', value: 2000, unit: 'kcal' },
            { date: 'Wed Sep 27 2023 20:30:30 GMT+0530', value: 2500, unit: 'kcal' },
            { date: 'Tue Sep 26 2023 20:30:30 GMT+0530', value: 2700, unit: 'kcal' },
            { date: 'Mon Sep 25 2023 20:30:30 GMT+0530', value: 3000, unit: 'kcal' },
            { date: 'Sun Sep 24 2023 20:30:30 GMT+0530', value: 2000, unit: 'kcal' },
            { date: 'Sat Sep 23 2023 20:30:30 GMT+0530', value: 2300, unit: 'kcal' },
            { date: 'Fri Sep 22 2023 20:30:30 GMT+0530', value: 2500, unit: 'kcal' },
            { date: 'Thu Sep 21 2023 20:30:30 GMT+0530', value: 2700, unit: 'kcal' },
        ];

        let dataForLineChart = temp.map((item: any) => item.value); // ✅ Numbers
        let dataForXAxis = temp.map((item: any) => new Date(item.date)); // ✅ Date objects

        setDataS1({
            data: dataForLineChart,
            title: '1 Day Calorie Intake',
            color: color,
            xAxis: {
                data: dataForXAxis,
                label: 'Last 10 Days',
                scaleType: 'time'
            }
        });
    }

    React.useEffect(() => {
        getDataForS1()
    }, [])

    const [showCalorieIntakePopup, setShowCalorieIntakePopup] = React.useState<boolean>(false)

    return (
        <div className='reportpage'>
            {dataS1 && (
                <>
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className={`s${index + 1}`}>
                            <LineChart
                                xAxis={[{
                                    id: 'Day',
                                    data: dataS1.xAxis.data,
                                    scaleType: dataS1.xAxis.scaleType,
                                    label: dataS1.xAxis.label,
                                    valueFormatter: (date: Date) => date.getDate().toString(), // Convert number to string
                                    // ✅ Valid Date
                                }]}
                                series={[{
                                    data: dataS1.data,
                                    label: dataS1.title,
                                    color: dataS1.color,
                                }]}
                                {...chartsParams}
                            />
                        </div>
                    ))}
                </>
            )}

            <button className='editbutton' onClick={() => setShowCalorieIntakePopup(true)}>
                <AiFillEdit />
            </button>

            {showCalorieIntakePopup && (
                <CaloriIntakePopup setShowCalorieIntakePopup={setShowCalorieIntakePopup} />
            )}
        </div>
    )
}

export default page
