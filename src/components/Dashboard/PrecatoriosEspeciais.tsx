import React from 'react'
import LOASynthesis from '../Charts/LOASynthesis'

const PrecatoriosEspeciais = () => {

    const treeMapData = [
        { 'LOA - Acumulado': 2006, 'TOTAL': 767775.65 },
        { 'LOA - Acumulado': 2011, 'TOTAL': 8145025.59 },
        { 'LOA - Acumulado': 2015, 'TOTAL': 442717.89 },
        { 'LOA - Acumulado': 2016, 'TOTAL': 275580.63 },
        { 'LOA - Acumulado': 2017, 'TOTAL': 1934918.3900000001 },
        { 'LOA - Acumulado': 2019, 'TOTAL': 2410012.44 },
        { 'LOA - Acumulado': 2021, 'TOTAL': 107.45 },
        { 'LOA - Acumulado': 2022, 'TOTAL': 306747.84 },
        { 'LOA - Acumulado': 2023, 'TOTAL': 55550349.3 },
        { 'LOA - Acumulado': 2024, 'TOTAL': 195756935.65000018 },
        { 'LOA - Acumulado': 2025, 'TOTAL': 184417001.29999992 },
        { 'LOA - Acumulado': 2026, 'TOTAL': 99541332.08000001 }
    ]

    return (
        <>
            <div className="container mx-auto pb-10 pt-4 bg-white dark:bg-boxdark rounded-md">
                <LOASynthesis data={treeMapData} />
            </div>
        </>
    )
}

export default PrecatoriosEspeciais