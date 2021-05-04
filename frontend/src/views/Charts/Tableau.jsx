import React, { useRef, useEffect } from 'react'

function Tableau() {
    const ref = useRef(null)

    const url = 'https://public.tableau.com/views/LearnEmbeddedAnalytics/SalesOverviewDashboard?:language=en&:display_count=y'

    useEffect(() => {
        new window.tableau.Viz(ref.current, url)
    }, [])

    return (
        <div>
            <div ref={ref}></div>
        </div>
    )
}
export default Tableau;
