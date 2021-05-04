import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

import './FrontPage.module.css'

export default function FrontPage() {
    return (
        <div className={'welcome'}>
            <h2>This is the Front Page</h2>
            <Button variant="outline-primary"> 
                <Link to="/dashboard">Dashboard</Link>
            </Button>          
        </div>
    )
}
