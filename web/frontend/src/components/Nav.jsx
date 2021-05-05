import React from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import '../css/styles.css'


export default function Nav() {
    return (
        <div className='nav-header'>
            <Button variant='outline-secondary' className='btn nav-btn'>
                <Link to='/' className='nav-link'>Home</Link>
            </Button>
            <Button variant='outline-secondary' className='btn nav-btn'>
                <Link to='/scenario-1' className='nav-link'>Scenario 1</Link>
            </Button>
            <Button variant='outline-secondary' className='btn nav-btn'>
                <Link to='/scenario-2' className='nav-link'>Scenario 2</Link>
            </Button>
            <Button variant='outline-secondary' className='btn nav-btn'>
                <Link to='/scenario-3' className='nav-link'>Scenario 3</Link>
            </Button>
        </div>
    )
}
