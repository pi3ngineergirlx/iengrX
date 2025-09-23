const Card = (props) => {
    return (
        <div className={'card '}>
            <h4>{props.title}</h4>
            <img src={props.image} alt={props.imagedescription} />
            <h5>{props.description}</h5>
            <button>{props.button}</button>
        </div>
    )
}

export default Card;