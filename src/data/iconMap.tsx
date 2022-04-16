import { BiPalette } from 'react-icons/bi';
import { FaRibbon } from 'react-icons/fa';
import { CgComedyCentral } from 'react-icons/cg';
import { GiStoneCrafting } from 'react-icons/gi';
import { GiBallerinaShoes } from 'react-icons/gi';
import { FcFilmReel } from 'react-icons/fc';
import { IoFastFoodSharp } from 'react-icons/io5';
import { MdGames } from 'react-icons/md';
import { GiTrowel } from 'react-icons/gi';
import { GiHealthIncrease } from 'react-icons/gi';
import { BiBookAlt } from 'react-icons/bi';
import { MdMusicNote } from 'react-icons/md';
import { MdNetworkCell } from 'react-icons/md';
import { BiCake } from 'react-icons/bi';
import { FaPrayingHands } from 'react-icons/fa';
import { AiFillShopping } from 'react-icons/ai';
import { BiBall } from 'react-icons/bi';

interface IconProps {
    [x:string] :  JSX.Element;
}
export const ICON_MAP: IconProps = {
    'Art': <BiPalette/>,
    'Causes': <FaRibbon/> ,
    'Comedy':  <CgComedyCentral/> ,
    'Craft': <GiStoneCrafting/>,
    'Dance': <GiBallerinaShoes/>,
    'Film': <FcFilmReel/>,
    'Food': <IoFastFoodSharp/> ,
    'Games': <MdGames/> ,
    'Gardening': <GiTrowel/>,
    'Health': <GiHealthIncrease/>,
    'Literature': <BiBookAlt/>,
    'Music': <MdMusicNote/>,
    'Network': < MdNetworkCell/>,
    'Party': <BiCake/>,
    'Religion': <FaPrayingHands/>,
    'Shopping': <AiFillShopping/>,
    'Sports': <BiBall/>
}