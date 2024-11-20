// stockData.js

// Import politician images
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

// Sample data with updated structure
const stockData = [
  { politician: 'Nancy Pelosi', party: 'Democrat', changeDollar: -5000, changePercent: -5, copiers: 120, lastTraded: '2023-11-15', imgSrc: nancyPelosi },
  { politician: 'Mitch McConnell', party: 'Republican', changeDollar: 7000, changePercent: 7, copiers: 300, lastTraded: '2023-11-17', imgSrc: mitchMcConnell },
  { politician: 'Chuck Schumer', party: 'Democrat', changeDollar: 3000, changePercent: 3, copiers: 210, lastTraded: '2023-11-16', imgSrc: chuckSchumer },
  { politician: 'Kevin McCarthy', party: 'Republican', changeDollar: -2000, changePercent: -2, copiers: 150, lastTraded: '2023-11-14', imgSrc: kevinMcCarthy },
  { politician: 'Elizabeth Warren', party: 'Democrat', changeDollar: 9000, changePercent: 9, copiers: 190, lastTraded: '2023-11-17', imgSrc: elizabethWarren },
  { politician: 'Bernie Sanders', party: 'Democrat', changeDollar: -4000, changePercent: -4, copiers: 175, lastTraded: '2023-11-10', imgSrc: bernieSanders },
  { politician: 'Kamala Harris', party: 'Democrat', changeDollar: 5000, changePercent: 5, copiers: 250, lastTraded: '2023-11-15', imgSrc: kamalaHarris },
  { politician: 'Ted Cruz', party: 'Republican', changeDollar: 6000, changePercent: 6, copiers: 180, lastTraded: '2023-11-13', imgSrc: tedCruz },
  { politician: 'Alexandria Ocasio-Cortez', party: 'Democrat', changeDollar: 10000, changePercent: 10, copiers: 400, lastTraded: '2023-11-17', imgSrc: alexandriaOcasioCortez },
  { politician: 'Rand Paul', party: 'Republican', changeDollar: -3000, changePercent: -3, copiers: 90, lastTraded: '2023-11-15', imgSrc: randPaul },
  { politician: 'Marco Rubio', party: 'Republican', changeDollar: 8000, changePercent: 8, copiers: 215, lastTraded: '2023-11-05', imgSrc: marcoRubio },
  { politician: 'Lindsey Graham', party: 'Republican', changeDollar: -1000, changePercent: -1, copiers: 95, lastTraded: '2023-11-13', imgSrc: lindseyGraham },
  { politician: 'Mitt Romney', party: 'Republican', changeDollar: 2000, changePercent: 2, copiers: 170, lastTraded: '2023-11-15', imgSrc: mittRomney },
  { politician: 'Josh Hawley', party: 'Republican', changeDollar: 6000, changePercent: 6, copiers: 110, lastTraded: '2023-11-12', imgSrc: joshHawley },
  { politician: 'Amy Klobuchar', party: 'Democrat', changeDollar: -2000, changePercent: -2, copiers: 130, lastTraded: '2023-11-10', imgSrc: amyKlobuchar },
  { politician: 'Gavin Newsom', party: 'Democrat', changeDollar: 12000, changePercent: 12, copiers: 250, lastTraded: '2023-11-15', imgSrc: gavinNewsom },
  { politician: 'Ron DeSantis', party: 'Republican', changeDollar: 11000, changePercent: 11, copiers: 500, lastTraded: '2023-11-13', imgSrc: ronDeSantis },
  { politician: 'Greg Abbott', party: 'Republican', changeDollar: 3000, changePercent: 3, copiers: 90, lastTraded: '2023-11-17', imgSrc: gregAbbott },
  { politician: 'Cory Booker', party: 'Democrat', changeDollar: -1000, changePercent: -1, copiers: 80, lastTraded: '2023-11-15', imgSrc: coryBooker },
  { politician: 'Tom Cotton', party: 'Republican', changeDollar: 4000, changePercent: 4, copiers: 160, lastTraded: '2023-11-15', imgSrc: tomCotton },
  { politician: 'Kristi Noem', party: 'Republican', changeDollar: 9000, changePercent: 9, copiers: 105, lastTraded: '2023-11-13', imgSrc: kristiNoem },
  { politician: 'Joe Biden', party: 'Democrat', changeDollar: -8000, changePercent: -8, copiers: 260, lastTraded: '2023-10-18', imgSrc: joeBiden },
  { politician: 'Sarah Huckabee Sanders', party: 'Republican', changeDollar: 7000, changePercent: 7, copiers: 130, lastTraded: '2023-11-12', imgSrc: sarahHuckabeeSanders },
  { politician: 'Gretchen Whitmer', party: 'Democrat', changeDollar: -4000, changePercent: -4, copiers: 180, lastTraded: '2023-11-05', imgSrc: gretchenWhitmer },
  { politician: 'Rick Scott', party: 'Republican', changeDollar: 5000, changePercent: 5, copiers: 220, lastTraded: '2023-11-15', imgSrc: rickScott },
];

export default stockData;
