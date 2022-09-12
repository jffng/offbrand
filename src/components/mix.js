import ReactPlayer from 'react-player';

const Mix = ( props ) => {
    const { url, name, about, published } = props;

    return (
        <div style={{maxWidth: '640px'}}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end'
            }}>
                <h3 style={{
                    marginBottom: '0',
                    fontWeight: '300'
                }}>{ name }</h3>
                <span style={{fontSize: 'var(--font-size--sm)'}}>{ published }</span>
            </div>
            <ReactPlayer url={url} options={{
                color: '#ffffff'
            }
            }/>
            <p style={{fontSize: 'var(--font-size--sm)'}}>{ about }</p>
        </div>
    );
}

export default Mix;