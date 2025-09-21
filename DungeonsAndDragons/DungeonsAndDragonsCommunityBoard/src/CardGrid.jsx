import Card from './Card';

const CardGrid = () => {
    return (
        <div className="card-grid">
            <div className='story'>
                <Card title='Zombie Apocalypse' 
                color ='black'
                description ='A futuristic biological take on the zombie apocalypse
                involving partial brain transplantation and neuroplasticity and how
                they affect personal identity as defined by the mind and thoughts in
                a capitalistic society prone to corruption'
                button ='Explore further'/>
            </div>
            <div className='cosplay'>
                <Card title='CAD' 
                color ='chartreuse'
                description ='CAD, or Computer-Aided Design, is a type of software
                that allows users to create precise drawings or technical illustrations.
                Learn to create 2D or 3D CAD models of various cosplay props for D&D 
                characters or your favorite characters from movies, shows, or books!'
                button ='Learn CAD'/>
                <Card title='Woodworking' 
                color ='chartreuse'
                description ='Learn to craft wooden props, weapons, and armor for
                your favorite characters! Develop skills for using various hand and
                power tools, as well as techniques for cutting, shaping, engraving,
                and joining wood.'
                button ='Learn Woodworking'/>
                <Card title='3D Printing' 
                color ='chartreuse'
                description ='3D printing is a form of additive manufacturing involving
                the production of `three-dimensional objects from a digital file, like a 
                CAD model. Make your CAD models come to life by 3D printing parts for your
                weapons, armor, and cosplay props!'
                button ='Learn 3D Printing!'/>
                <Card title='Sewing' 
                color ='chartreuse'
                description ='Learn to sew and create costumes for your favorite D&D characters,
                or for any other characters from movies, shows, or books! Develop skills
                for using a sewing machine, as well as techniques for hand sewing, fabric
                cutting, and pattern making.'
                button ='Learn Sewing!'/>
                <Card title='Cosplay Conventions' 
                color ='chartreuse'
                description ='Cosplay as your favorite D&D characters, or as any
                other characters from movies, shows, or books, and meet other fans!
                Showcase your crafting and STEM skills, and connect to pop culture!'
                button ='Find Cosplay Events'/>
            </div>
            <div className='gaming'>
                <Card title='Rules' 
                color ='white'
                description ='Dungeons and Dragons is a tabletop role-playing game (RPG)
                where players create characters and develop adventures led by a
                Dungeon Master (DM). The game is played using dice, miniatures, and 
                maps to represent the characters and their surroundings.'
                button ='Learn D&D Rules'/>
            </div>
        </div>
    );
};

export default CardGrid;