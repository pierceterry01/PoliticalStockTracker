import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/StockViewPage.css';
import nancyPelosi from '../assets/politician-images/nancy-pelosi.jpg';
import mitchMcConnell from '../assets/politician-images/mitch-mcconnell.jpg';
import chuckSchumer from '../assets/politician-images/chuck-schumer.jpg';
import kevinMcCarthy from '../assets/politician-images/kevin-mccarthy.jpg';
import elizabethWarren from '../assets/politician-images/elizabeth-warren.jpg';
import bernieSanders from '../assets/politician-images/bernie-sanders.jpg';
import kamalaHarris from '../assets/politician-images/kamala-harris.jpg';
import tedCruz from '../assets/politician-images/ted-cruz.jpg';
import alexandriaOcasioCortez from '../assets/politician-images/alexandria-ocasio-cortez.jpg';
import randPaul from '../assets/politician-images/rand-paul.jpg';
import marcoRubio from '../assets/politician-images/marco-rubio.jpg';
import lindseyGraham from '../assets/politician-images/lindsey-graham.jpg';
import mittRomney from '../assets/politician-images/mitt-romney.jpg';
import joshHawley from '../assets/politician-images/josh-hawley.jpg';
import amyKlobuchar from '../assets/politician-images/amy-klobuchar.jpg';
import gavinNewsom from '../assets/politician-images/gavin-newsom.jpg';
import ronDeSantis from '../assets/politician-images/ron-desantis.jpg';
import gregAbbott from '../assets/politician-images/greg-abbott.jpg';
import coryBooker from '../assets/politician-images/cory-booker.jpg';
import tomCotton from '../assets/politician-images/tom-cotton.jpg';
import kristiNoem from '../assets/politician-images/kristi-noem.jpg';
import joeBiden from '../assets/politician-images/joe-biden.jpg';
import sarahHuckabeeSanders from '../assets/politician-images/sarah-huckabee-sanders.jpg';
import gretchenWhitmer from '../assets/politician-images/gretchen-whitmer.jpg';
import rickScott from '../assets/politician-images/rick-scott.jpg';

// Sample data with 25 politicians
const stockData = [
    { politician: 'Nancy Pelosi', party: 'Democrat', change: '-5%', copiers: 120, lastTraded: '2 days ago', imgSrc: nancyPelosi },
    { politician: 'Mitch McConnell', party: 'Republican', change: '+7%', copiers: 300, lastTraded: '5 hours ago', imgSrc: mitchMcConnell },
    { politician: 'Chuck Schumer', party: 'Democrat', change: '+3%', copiers: 210, lastTraded: '12 hours ago', imgSrc: chuckSchumer },
    { politician: 'Kevin McCarthy', party: 'Republican', change: '-2%', copiers: 150, lastTraded: '1 day ago', imgSrc: kevinMcCarthy },
    { politician: 'Elizabeth Warren', party: 'Democrat', change: '+9%', copiers: 190, lastTraded: '3 hours ago', imgSrc: elizabethWarren },
    { politician: 'Bernie Sanders', party: 'Democrat', change: '-4%', copiers: 175, lastTraded: '1 week ago', imgSrc: bernieSanders },
    { politician: 'Kamala Harris', party: 'Democrat', change: '+5%', copiers: 250, lastTraded: '2 days ago', imgSrc: kamalaHarris },
    { politician: 'Ted Cruz', party: 'Republican', change: '+6%', copiers: 180, lastTraded: '3 days ago', imgSrc: tedCruz },
    { politician: 'Alexandria Ocasio-Cortez', party: 'Democrat', change: '+10%', copiers: 400, lastTraded: '6 hours ago', imgSrc: alexandriaOcasioCortez },
    { politician: 'Rand Paul', party: 'Republican', change: '-3%', copiers: 90, lastTraded: '1 day ago', imgSrc: randPaul },
    { politician: 'Marco Rubio', party: 'Republican', change: '+8%', copiers: 215, lastTraded: '2 weeks ago', imgSrc: marcoRubio },
    { politician: 'Lindsey Graham', party: 'Republican', change: '-1%', copiers: 95, lastTraded: '3 days ago', imgSrc: lindseyGraham },
    { politician: 'Mitt Romney', party: 'Republican', change: '+2%', copiers: 170, lastTraded: '1 day ago', imgSrc: mittRomney },
    { politician: 'Josh Hawley', party: 'Republican', change: '+6%', copiers: 110, lastTraded: '4 days ago', imgSrc: joshHawley },
    { politician: 'Amy Klobuchar', party: 'Democrat', change: '-2%', copiers: 130, lastTraded: '1 week ago', imgSrc: amyKlobuchar },
    { politician: 'Gavin Newsom', party: 'Democrat', change: '+12%', copiers: 250, lastTraded: '1 day ago', imgSrc: gavinNewsom },
    { politician: 'Ron DeSantis', party: 'Republican', change: '+11%', copiers: 500, lastTraded: '4 days ago', imgSrc: ronDeSantis },
    { politician: 'Greg Abbott', party: 'Republican', change: '+3%', copiers: 90, lastTraded: '5 hours ago', imgSrc: gregAbbott },
    { politician: 'Cory Booker', party: 'Democrat', change: '-1%', copiers: 80, lastTraded: '1 day ago', imgSrc: coryBooker },
    { politician: 'Tom Cotton', party: 'Republican', change: '+4%', copiers: 160, lastTraded: '2 days ago', imgSrc: tomCotton },
    { politician: 'Kristi Noem', party: 'Republican', change: '+9%', copiers: 105, lastTraded: '3 days ago', imgSrc: kristiNoem },
    { politician: 'Joe Biden', party: 'Democrat', change: '-8%', copiers: 260, lastTraded: '4 weeks ago', imgSrc: joeBiden },
    { politician: 'Sarah Huckabee Sanders', party: 'Republican', change: '+7%', copiers: 130, lastTraded: '5 days ago', imgSrc: sarahHuckabeeSanders },
    { politician: 'Gretchen Whitmer', party: 'Democrat', change: '-4%', copiers: 180, lastTraded: '2 weeks ago', imgSrc: gretchenWhitmer },
    { politician: 'Rick Scott', party: 'Republican', change: '+5%', copiers: 220, lastTraded: '1 day ago', imgSrc: rickScott },
];

// Sorting helper functions
const sortBy = {
    name: (a, b) => a.politician.localeCompare(b.politician),
    change: (a, b) => parseFloat(b.change) - parseFloat(a.change),
    copiers: (a, b) => b.copiers - a.copiers,
    lastTraded: (a, b) => new Date(b.lastTraded) - new Date(a.lastTraded),
};

function StockViewPage() {
    const [sortedData, setSortedData] = useState(stockData);
    const [sortKey, setSortKey] = useState('name');

    // Handle sorting based on the column header clicked
    const handleSort = (key) => {
        const sorted = [...sortedData].sort(sortBy[key]);
        setSortKey(key);
        setSortedData(sorted);
    };

    return (
        <div className="stock-view-page">
            {/* Top Navigation */}
            <header className="stock-view-header">
                <Link to="/" className="logo">Outsider Trading</Link> {/* Logo link to homepage */}
                <div className="header-icons">
                    <div className="profile">
                        <span className="profile-icon">&#128100;</span>
                        <span className="profile-name">Username</span>
                    </div>
                    <div className="settings">
                        <span className="settings-icon">&#9881;</span>
                    </div>
                </div>
            </header>

            {/* Main Content Section */}
            <div className="stock-view-content">
                {/* Search Bar */}
                <div className="search-bar">
                    <input type="text" placeholder="Search" className="search-input" /> {/* Input for searching politicians */}
                </div>

                {/* Data Table */}
                <table className="stock-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('name')}>Politician</th> {/* Politician name column */}
                            <th onClick={() => handleSort('change')}>% Change</th> {/* % Change column */}
                            <th onClick={() => handleSort('copiers')}>Copiers</th> {/* Copiers column */}
                            <th onClick={() => handleSort('lastTraded')}>Last Traded</th> {/* Last traded column */}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Mapping over sorted data to render each row */}
                        {sortedData.map((row, index) => (
                            <tr key={index}>
                                <td>
                                    <img src={row.imgSrc} alt={row.politician} className="politician-image" />
                                    <span className={`politician-name ${row.party.toLowerCase()}`}>
                                        {row.politician}
                                    </span>
                                </td>
                                <td className="percent-change">{row.change}</td>
                                <td>{row.copiers}</td>
                                <td>{row.lastTraded}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StockViewPage;
