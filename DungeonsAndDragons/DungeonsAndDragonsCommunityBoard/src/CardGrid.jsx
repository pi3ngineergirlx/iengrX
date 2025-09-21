import Card from './Card';

const CardGrid = () => {
    return (
        <div className="card-grid">
            <div className='story'>
                <Card title='Zombie Apocalypse' 
                color ='chartreuse'
                description ='A futuristic biological take on the zombie apocalypse
                involving partial brain transplantation and neuroplasticity and how
                they affect personal identity as defined by the mind and thoughts in
                a capitalistic society prone to corruption'
                button ='Explore further'/>
            </div>
            <div className='cosplay'>

            </div>
            <div className='gaming'>

            </div>
        </div>
    );
};

export default CardGrid;