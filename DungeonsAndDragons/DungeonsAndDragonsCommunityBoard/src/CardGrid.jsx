import Card from './Card';

const CardGrid = () => {
    return (
        <div className="card-grid">
            <div className='gaming'>
                <div className='gaming-header'>
                    <h3>Gaming</h3>
                </div>
                <div className='gaming-cards'>
                    <Card title='Rules' 
                    description='Dungeons and Dragons is a tabletop role-playing game
                    (RPG) where players create characters and develop adventures led by
                    a Dungeon Master (DM). The game is played using dice, miniatures,
                    and maps to represent the characters and their surroundings.'
                    button='Learn D&D Rules'/>
                    <Card title='Science Fiction D&D' 
                    description='iengrX explores a sci-fi and futuristic take on Dungeons
                    and Dragons, with a focus on biological and technological themes.
                    Create futuristic cities focused on sustainability and human- centered
                    design, and apply your knowledge of science and engineering!'
                    button='Explore Sci-Fi D&D'/>
                </div>
            </div>
            <div className='story'>
                <div className='story-header'>
                    <h3>Story</h3>
                </div>
                <div className='story-cards'>
                    <Card title='Zombie Apocalypse' 
                    description='A futuristic biological take on the zombie apocalypse
                    involving partial brain transplantation and neuroplasticity and how
                    they affect personal identity as defined by the mind and thoughts in
                    a capitalistic society prone to corruption'
                    button='Explore further'/>
                    <Card title='Parallel Universes' 
                    description='Explore the theory of the multiverse and how it emerges
                    from multiple realities emerging from quantum events. It has been
                    theorized that for every possibility, a universe exists. Create stories
                    in which your characters can travel between these universes and possibly
                    meet alternate versions of themselves!'
                    button='Explore further'/>
                    <Card title='Extraterrestrial Life' 
                    description='Ponder the existence of life elsewhere in the universe, and
                    how humans might interact with extraterrestrial civilizations. Theorize
                    about the biological properties and evolution of alien species based on
                    their environment. Search for a planet in the Goldilocks Zone of another
                    solar system.'
                    button='Explore further'/>
                </div>
            </div>
            <div className='cosplay'>
                <div className='cosplay-header'>
                    <h3>Cosplay</h3>
                </div>
                <div className='cosplay-cards'>
                    <Card title='CAD' 
                    description='CAD, or Computer-Aided Design, is a type of software that
                    allows users to create precise drawings or technical illustrations.
                    Learn to create 2D or 3D CAD models of various cosplay props for D&D
                    characters or your favorite characters from movies, shows, or books!'
                    button='Learn CAD'/>
                    <Card title='Woodworking'
                    description='Learn to craft wooden props, weapons, and armor for your
                    favorite characters! Develop skills for using various hand and power
                    tools, as well as techniques for cutting, shaping, engraving, and
                    joining wood.'
                    button='Learn Woodworking'/>
                    <Card 
                    title='3D Printing' 
                    description='3D printing is a form of additive manufacturing involving
                    the production of three-dimensional objects from a digital file, like a
                    CAD model. Make your CAD models come to life by 3D printing parts for
                    your weapons, armor, and cosplay props!'
                    button='Learn 3D Printing!'/>
                    <Card title='Sewing'
                    description='Learn to sew and create costumes for your favorite D&D
                    characters, or for any other characters from movies, shows, or books!
                    Develop skills for using a sewing machine, as well as techniques for
                    hand sewing, fabric cutting, and pattern making.'
                    button='Learn Sewing!'/>
                    <Card title='Cosplay Conventions'
                    description='Cosplay as your favorite D&D characters, or as any other
                    characters from movies, shows, or books, and meet other fans! Showcase
                    your crafting and STEM skills, and connect to pop culture!'
                    button='Find Cosplay Events'/>
                </div>
            </div>
        </div>
    );
};

export default CardGrid;