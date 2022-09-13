import Marquee from "react-fast-marquee";
import background from '../assets/background.webp';
import { ReactComponent as Play } from '../assets/play.svg';
import { ReactComponent as Pause } from '../assets/pause.svg';

const PlayerUI = ( { playHandler, isPlaying, currentTime }) => {
    return (
        <div style={{
            position: 'absolute',
            marginLeft: 'calc( -1 * var(--spacing-outer) )',
            marginRight: 'calc( -1 * var(--spacing-outer) )',
            bottom: 0,
            display: 'flex',
            fontFamily:'monospace',
            width: '100%',
            background: `url(${background})`,
            border: '1px solid white',
            maxWidth: 'calc(660px + var(--spacing-outer)',
            alignItems: 'center',
            // background: 'rgba(255,255,255,.1)'
        }}>
        <button 
        style={{
            borderRight: '1px solid white',
            padding: '0',
            display: 'flex'
        }}
        onClick={playHandler}>{ isPlaying ? <Pause/> : <Play/> }</button>
        <Marquee
        gradient={false}
        speed={40}
        style={{
            color: 'black',
            fontFamily:'monospace'
        }}
        play={ isPlaying ? true : false }
        pauseOnHover={true}
        >Summer in London (Took a Trip)&nbsp;&nbsp;</Marquee>
        </div>
    )
}

export default PlayerUI;