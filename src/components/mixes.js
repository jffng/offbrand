import Mix from './mix';

const MIXES = [
    {
        "url": "https://soundcloud.com/offbrandnyc/jizo-take-the-wheel",
        "name": "Jizo Take the Wheel",
        "published": "November 2021",
        "about": "In certain Buddhist traditions, children who die before their parents cannot cross the river into the afterlife without help. The Jizo (pictured in the cover image) acts as a guardian and warder of evil on this journey, helping them reach the afterlife. This mix imagines that journey.\n\nOriginally aired 17 Nov, 2021 on empty plate radio. photo credit g_w_w.",
        "tags": []
    },
    {
        "url": "https://soundcloud.com/offbrandnyc/goodbye-earth",
        "name": "Goodbye Earth",
        "published": "July 2020",
        "about": "Recorded summer of lockdown, this mix is a club rocketship. Takeoff, no landing.",
        "tags": []
    },
    {
        "url": "https://soundcloud.com/offbrandnyc/beat-the-drum",
        "name": "Beat the Drum",
        "published": "December 2021",
        "about": "Nightclub turns into Jungle safari soundtracked by polyrhymic delight.",
        "tags": []
    },
    {
        "url": "https://soundcloud.com/offbrandnyc/i-94",
        "name": "I-94",
        "published": "July 2019",
        "about": "I-94 connects Chicago and Detroit, by about 300 miles. I grew up half way between and this mix is an homage to those roots.",
        "tags": []
    },
];

const Mixes = () => {
    const mixes = MIXES.map( m => {
        return (
            <Mix {...m}/>
        )
    })

    return (
        <div style={{
            marginTop: '-2rem',
            overflow: 'scroll'
        }}>
            <p>A selection of mixes recorded over from 2019 - 2022</p>
            { mixes }
        </div>
    )
}

export default Mixes;