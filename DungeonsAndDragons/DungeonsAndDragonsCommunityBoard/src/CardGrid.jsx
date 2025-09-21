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
                <Card title='CAD' 
                color ='black'
                description ='CAD, or Computer-Aided Design, is a type of software
                that allows users to create precise drawings or technical illustrations.
                Learn to create 2D or 3D CAD models of various cosplay props for D&D 
                characters or your favorite characters from movies, shows, or books!'
                button ='Learn CAD'/>
                <Card title='Cosplay Conventions' 
                color ='black'
                description ='Cosplay as your favorite D&D characters, or as any
                other characters from movies, shows, or books, and meet other fans!
                Showcase your crafting and STEM skills, and connect to pop culture!'
                button ='Find Cosplay Events'/>
            </div>
            <div className='gaming'>

            </div>
        </div>
    );
};

export default CardGrid;