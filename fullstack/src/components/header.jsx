export default function Header() {
    return (
        <header className="page-header" style={{ 
            padding: '1rem', 
            color: '#f0f0f0',
            textAlign: 'center',
            marginBottom: '1rem',
            top: 0,
            zIndex: 1000,
            width: '100%'
        }}>
            <h1 style={{ 
                fontSize: '2rem', 
                fontWeight: '700', 
                lineHeight: 1.2
            }}>
                Otago Polytechnic Weather Station
            </h1>
            <div style={{
                margin: '1rem auto 0',
                width: '80%', 
                height: '1px',
                backgroundColor: 'rgba(240, 240, 240, 0.7)' 
            }}></div>
        </header>
    );
}
